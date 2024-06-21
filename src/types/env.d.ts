namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;
        ACCESS_TOKEN_SECRET: string;
        SMTP_HOST: string;
        SMTP_PORT: number;
        SMTP_USER: string;
        SMTP_PASS: string;
        FROM_EMAIL: string;
        GST_API_KEY: string;
    }
}