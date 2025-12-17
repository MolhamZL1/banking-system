import bcrypt from 'bcrypt';
import { HttpError } from '../errors/http-error';
import { UserRepo } from '../../repositories/user.repo';
import { RefreshTokenRepo } from '../../repositories/refreshToken.repo';
import { EmailVerificationRepo } from '../../repositories/emailVerification.repo';
import { mailer } from '../../infrastructure/mailer/mailer';
import { sha256 } from '../../infrastructure/auth/hash';
import { signAccessToken, signRefreshToken, verifyToken } from '../../infrastructure/auth/jwt';
import { Role } from '@prisma/client';

function random6Digits() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export class AuthService {
  constructor(
    private readonly users = new UserRepo(),
    private readonly refreshRepo = new RefreshTokenRepo(),
    private readonly emailRepo = new EmailVerificationRepo()
  ) {}
 async createStaff(input: { username: string; password: string; email: string; phone?: string , role: Role}) {
    const byUsername = await this.users.findByUsername(input.username);
    if (byUsername) throw new HttpError(409, 'Username already exists');

    const byEmail = await this.users.findByEmail(input.email);
    if (byEmail) {
      if (byEmail.isEmailVerified) throw new HttpError(409, 'Email already registered');
    
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    await this.users.create({
      username: input.username,
      passwordHash,
      email: input.email,
      phone: input.phone,
      role: input.role,
      isEmailVerified: true,
    });


    return { ok: true, message: 'Registered.' };
  }

  // ✅ Register: creates user NOT verified + sends code
  // ✅ If email exists & NOT verified => just resend code (no new user)
  async register(input: { username: string; password: string; email: string; phone?: string }) {
    const byUsername = await this.users.findByUsername(input.username);
    if (byUsername) throw new HttpError(409, 'Username already exists');

    const byEmail = await this.users.findByEmail(input.email);
    if (byEmail) {
      if (byEmail.isEmailVerified) throw new HttpError(409, 'Email already registered');
      // existing but not verified => resend code
      await this.sendVerificationCode(input.email);
      return { ok: true, message: 'Account exists but not verified. Code resent.' };
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    await this.users.create({
      username: input.username,
      passwordHash,
      email: input.email,
      phone: input.phone,
      role: 'CUSTOMER',
      isEmailVerified: false,
    });

    await this.sendVerificationCode(input.email);

    return { ok: true, message: 'Registered. Verification code sent to email.' };
  }

  // ✅ Resend code (only if user exists and NOT verified)
  async resendCode(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new HttpError(404, 'User not found');
    if (user.isEmailVerified) return { ok: true, message: 'Already verified' };

    await this.sendVerificationCode(email);
    return { ok: true, message: 'Verification code resent' };
  }

  // ✅ Verify email => activates account + returns tokens
  async verifyEmail(input: { email: string; code: string }) {
    const user = await this.users.findByEmail(input.email);
    if (!user) throw new HttpError(404, 'User not found');

    if (user.isEmailVerified) {
      // optional: still issue tokens if already verified
      const tokens = await this.issueTokens(user.id, user.role);
      return { ok: true, message: 'Already verified', ...tokens };
    }

    const record = await this.emailRepo.findValid(input.email, sha256(input.code));
    if (!record) throw new HttpError(400, 'Invalid or expired code');

    await this.emailRepo.markUsed(record.id);
    const updated = await this.users.setEmailVerified(user.id);

    const tokens = await this.issueTokens(updated.id, updated.role);
    return { ok: true, message: 'Email verified', ...tokens };
  }

  async login(input: { username: string; password: string }) {
    const user = await this.users.findByUsername(input.username);
    if (!user) throw new HttpError(401, 'Invalid credentials');

    if (!user.isEmailVerified) throw new HttpError(403, 'Email not verified');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw new HttpError(401, 'Invalid credentials');

    const tokens = await this.issueTokens(user.id, user.role);
    return { user: this.safeUser(user), ...tokens };
  }

  // refresh rotation
  async refresh(refreshToken: string) {
    const payload = verifyToken(refreshToken);
    const tokenHash = sha256(refreshToken);

    const found = await this.refreshRepo.findValid(tokenHash);
    if (!found) throw new HttpError(401, 'Refresh token invalid, revoked, or expired');

    await this.refreshRepo.revokeByHash(tokenHash);

    const tokens = await this.issueTokens(payload.userId, found.user.role);
    return tokens;
  }

  async logout(refreshToken: string) {
    await this.refreshRepo.revokeByHash(sha256(refreshToken));
    return { ok: true };
  }

  async me(userId: number) {
    const user = await this.users.findById(userId);
    if (!user) throw new HttpError(404, 'User not found');
    return this.safeUser(user);
  }

  // ---------- helpers ----------
  private async sendVerificationCode(email: string) {
    const code = random6Digits();
    const codeHash = sha256(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.emailRepo.create(email, codeHash, expiresAt);

    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your email',
      text: `Your verification code is: ${code} (expires in 10 minutes)`,
    });
  }

  private async issueTokens(userId: number, role: string) {
    const payload = { userId, role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // approximate expiry (match env 30d)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await this.refreshRepo.create(userId, sha256(refreshToken), expiresAt);

    return { accessToken, refreshToken };
  }

  private safeUser(u: any) {
    const { passwordHash, ...rest } = u;
    return rest;
  }
}
