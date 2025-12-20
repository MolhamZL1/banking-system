"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_error_1 = require("../errors/http-error");
const user_repo_1 = require("../../repositories/user.repo");
const refreshToken_repo_1 = require("../../repositories/refreshToken.repo");
const emailVerification_repo_1 = require("../../repositories/emailVerification.repo");
const mailer_1 = require("../../infrastructure/mailer/mailer");
const hash_1 = require("../../infrastructure/auth/hash");
const jwt_1 = require("../../infrastructure/auth/jwt");
function random6Digits() {
    return String(Math.floor(100000 + Math.random() * 900000));
}
class AuthService {
    constructor(users = new user_repo_1.UserRepo(), refreshRepo = new refreshToken_repo_1.RefreshTokenRepo(), emailRepo = new emailVerification_repo_1.EmailVerificationRepo()) {
        this.users = users;
        this.refreshRepo = refreshRepo;
        this.emailRepo = emailRepo;
    }
    async createStaff(input) {
        const byUsername = await this.users.findByUsername(input.username);
        if (byUsername)
            throw new http_error_1.HttpError(409, 'Username already exists');
        const byEmail = await this.users.findByEmail(input.email);
        if (byEmail) {
            if (byEmail.isEmailVerified)
                throw new http_error_1.HttpError(409, 'Email already registered');
        }
        const passwordHash = await bcrypt_1.default.hash(input.password, 10);
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
    async register(input) {
        const byUsername = await this.users.findByUsername(input.username);
        if (byUsername)
            throw new http_error_1.HttpError(409, 'Username already exists');
        const byEmail = await this.users.findByEmail(input.email);
        if (byEmail) {
            if (byEmail.isEmailVerified)
                throw new http_error_1.HttpError(409, 'Email already registered');
            // existing but not verified => resend code
            await this.sendVerificationCode(input.email);
            return { ok: true, message: 'Account exists but not verified. Code resent.' };
        }
        const passwordHash = await bcrypt_1.default.hash(input.password, 10);
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
    async resendCode(email) {
        const user = await this.users.findByEmail(email);
        if (!user)
            throw new http_error_1.HttpError(404, 'User not found');
        if (user.isEmailVerified)
            return { ok: true, message: 'Already verified' };
        await this.sendVerificationCode(email);
        return { ok: true, message: 'Verification code resent' };
    }
    // ✅ Verify email => activates account + returns tokens
    async verifyEmail(input) {
        const user = await this.users.findByEmail(input.email);
        if (!user)
            throw new http_error_1.HttpError(404, 'User not found');
        if (user.isEmailVerified) {
            // optional: still issue tokens if already verified
            const tokens = await this.issueTokens(user.id, user.role);
            return { ok: true, message: 'Already verified', ...tokens };
        }
        const record = await this.emailRepo.findValid(input.email, (0, hash_1.sha256)(input.code));
        if (!record)
            throw new http_error_1.HttpError(400, 'Invalid or expired code');
        await this.emailRepo.markUsed(record.id);
        const updated = await this.users.setEmailVerified(user.id);
        const tokens = await this.issueTokens(updated.id, updated.role);
        return { ok: true, message: 'Email verified', ...tokens };
    }
    async login(input) {
        const user = await this.users.findByUsername(input.username);
        if (!user)
            throw new http_error_1.HttpError(401, 'Invalid credentials');
        if (!user.isEmailVerified)
            throw new http_error_1.HttpError(403, 'Email not verified');
        const ok = await bcrypt_1.default.compare(input.password, user.passwordHash);
        if (!ok)
            throw new http_error_1.HttpError(401, 'Invalid credentials');
        const tokens = await this.issueTokens(user.id, user.role);
        return { user: this.safeUser(user), ...tokens };
    }
    // refresh rotation
    async refresh(refreshToken) {
        const payload = (0, jwt_1.verifyToken)(refreshToken);
        const tokenHash = (0, hash_1.sha256)(refreshToken);
        const found = await this.refreshRepo.findValid(tokenHash);
        if (!found)
            throw new http_error_1.HttpError(401, 'Refresh token invalid, revoked, or expired');
        await this.refreshRepo.revokeByHash(tokenHash);
        const tokens = await this.issueTokens(payload.userId, found.user.role);
        return tokens;
    }
    async logout(refreshToken) {
        await this.refreshRepo.revokeByHash((0, hash_1.sha256)(refreshToken));
        return { ok: true };
    }
    async me(userId) {
        const user = await this.users.findById(userId);
        if (!user)
            throw new http_error_1.HttpError(404, 'User not found');
        return this.safeUser(user);
    }
    // ---------- helpers ----------
    async sendVerificationCode(email) {
        const code = random6Digits();
        const codeHash = (0, hash_1.sha256)(code);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await this.emailRepo.create(email, codeHash, expiresAt);
        await mailer_1.mailer.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Verify your email',
            text: `Your verification code is: ${code} (expires in 10 minutes)`,
        });
    }
    async issueTokens(userId, role) {
        const payload = { userId, role };
        const accessToken = (0, jwt_1.signAccessToken)(payload);
        const refreshToken = (0, jwt_1.signRefreshToken)(payload);
        // approximate expiry (match env 30d)
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await this.refreshRepo.create(userId, (0, hash_1.sha256)(refreshToken), expiresAt);
        return { accessToken, refreshToken };
    }
    safeUser(u) {
        const { passwordHash, ...rest } = u;
        return rest;
    }
}
exports.AuthService = AuthService;
