declare module 'jsonwebtoken' {
  export type Secret =
    | string
    | Buffer
    | { key: string | Buffer; passphrase: string };

  export interface SignOptions {
    expiresIn?: string | number;
  }

  export interface VerifyOptions {
    // Add fields as needed; kept minimal for current usage.
  }

  export type JwtPayload = { [key: string]: any };

  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: Secret,
    options?: SignOptions
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: Secret,
    options?: VerifyOptions
  ): string | JwtPayload;

  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
  };

  export default jwt;
}
