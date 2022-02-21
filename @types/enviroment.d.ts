declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      VERIFICATION_TOKEN_EXPIRATION_MINUTES: string;
      LOGIN_TOKEN_EXPIRATION_MINUTES: string;
      AUTH_TOKEN_EXPIRATION_MINUTES: string;
      JWT_SECRET: string;
    }
  }
}
export {};
