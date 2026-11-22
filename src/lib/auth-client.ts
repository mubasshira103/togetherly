import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  // Fall back to the current origin so the client keeps working if the public
  // env variable is not set for a deployment.
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof window !== 'undefined' ? window.location.origin : undefined),
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [jwtClient()],
});
