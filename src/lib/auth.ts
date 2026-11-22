import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';

const mongoURL = process.env.MONGODB_URL;

if (!mongoURL) {
  throw new Error('MONGODB_URL is missing. Add it to your .env file before starting the app.');
}

// Keep a single MongoClient alive across dev-server hot reloads instead of
// opening a brand new connection pool on every recompile.
const globalForMongo = globalThis as typeof globalThis & {
  __kindoraMongoClient?: MongoClient;
};
const client = globalForMongo.__kindoraMongoClient ?? new MongoClient(mongoURL);

if (process.env.NODE_ENV !== 'production') {
  globalForMongo.__kindoraMongoClient = client;
}

const db = client.db('ticketoDb');

const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

// Treat the sample values shipped in .env files as "not configured" so a
// placeholder never enables a provider with invalid credentials.
const isPlaceholder = (value?: string) =>
  !value || value.startsWith('your-') || value.startsWith('replace-');

// Better Auth's documented names are GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET.
// The older BETTER_AUTH_GOOGLE_* names are accepted too so existing .env files
// keep working.
const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.BETTER_AUTH_GOOGLE_CLIENT_ID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.BETTER_AUTH_GOOGLE_SECRET;
const googleEnabled = !isPlaceholder(googleClientId) && !isPlaceholder(googleClientSecret);

// Origins allowed to start an auth flow / receive a callback. The base URL is
// always trusted by Better Auth; these extras cover localhost aliases and the
// public URL used by the sibling API.
const trustedOrigins = Array.from(
  new Set(
    [
      baseURL,
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      process.env.CLIENT_URL,
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : []),
    ].filter((origin): origin is string => Boolean(origin))
  )
);

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    // The register form allows 6+ characters, so the server must accept the
    // same length (Better Auth defaults to 8).
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: googleClientId as string,
          clientSecret: googleClientSecret as string,
        },
      }
    : {},
  trustedOrigins,
  plugins: [
    jwt({
      jwt: {
        // The Express API verifies tokens against the Next.js app URL for both
        // issuer and audience, so pin them to the configured base URL.
        issuer: baseURL,
        audience: baseURL,
      },
    }),
    // Must be the last plugin: lets Better Auth write session cookies through
    // the Next.js cookies() API.
    nextCookies(),
  ],
});
