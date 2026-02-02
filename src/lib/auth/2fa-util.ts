import { authenticator } from "otplib";

export const generateTwoFactorSecret = (email: string) => {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(email, "Al Huda Network", secret);
    return { secret, otpauth };
};

export const verifyTwoFactorToken = (token: string, secret: string) => {
    return authenticator.check(token, secret);
};
