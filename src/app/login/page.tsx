'use client';

import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const OAUTH_ERRORS: Record<string, string> = {
  access_denied: 'Google sign-in was cancelled.',
  account_not_linked: 'This Google account is not linked to an existing account.',
  email_not_found: 'Google did not share an email address for this account.',
  email_not_verified: 'Your Google email address is not verified.',
  invalid_callback_request: 'The Google sign-in response was invalid. Please try again.',
  no_code: 'Google did not return an authorization code. Please try again.',
  provider_not_found: 'Google sign-in is not configured on this server.',
  signup_disabled: 'New accounts cannot be created with Google right now.',
  state_mismatch: 'The Google sign-in session expired. Please try again.',
  state_not_found: 'The Google sign-in session expired. Please try again.',
  unable_to_get_user_info: 'Could not read your Google profile. Please try again.',
};

function googleErrorMessage(code?: string, description?: string | null) {
  // useSearchParams already decodes the query string, so use the description as-is.
  if (description) {
    return description;
  }
  if (code && OAUTH_ERRORS[code]) {
    return OAUTH_ERRORS[code];
  }
  return 'Google sign-in failed. Please try again.';
}

export default function Login() {
  return (
    <Suspense fallback={<section className="container section max-w-xl">Loading…</section>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  const errorCode = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const oauthSuccess = searchParams.get('oauth') === 'success';
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    if (errorCode) {
      handledRef.current = true;
      toast.error(googleErrorMessage(errorCode, errorDescription));
      router.replace('/login');
      return;
    }

    if (!isPending && session) {
      handledRef.current = true;
      if (oauthSuccess) toast.success('Signed in with Google');
      router.replace('/');
    }
  }, [errorCode, errorDescription, oauthSuccess, isPending, session, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || googleBusy) return;

    setBusy(true);
    try {
      const r = await authClient.signIn.email({ email: email.trim(), password });
      if (r.error) {
        toast.error(r.error.message || 'Unable to sign in');
        return;
      }
      toast.success('Welcome back!');
      router.push('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    if (busy || googleBusy) return;

    setGoogleBusy(true);
    try {
      const result = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/login?oauth=success',
        errorCallbackURL: '/login?oauth=error',
      });

      if (result.error) {
        setGoogleBusy(false);
        if (result.error.code === 'PROVIDER_NOT_FOUND') {
          toast.error(
            'Google sign-in is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.'
          );
        } else {
          toast.error(result.error.message || 'Google sign-in failed');
        }
      }
      // On success Better Auth redirects the browser to Google, so the loading
      // state intentionally stays until the page unloads.
    } catch (error) {
      setGoogleBusy(false);
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed');
    }
  }

  return (
    <section className="container section max-w-xl">
      <div className="card p-8 md:p-10">
        <span className="eyebrow">Welcome back</span>
        <h1 className="mt-3 text-3xl font-black">Sign in to Kindora</h1>
        <p className="mt-2 text-sm muted">Your community is waiting for you.</p>
        <form onSubmit={submit} className="mt-8 grid gap-4">
          <label className="text-sm font-semibold">
            Email
            <input
              className="field mt-2"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="text-sm font-semibold">
            Password
            <input
              className="field mt-2"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button disabled={busy || googleBusy} className="btn mt-2">
            {busy ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs muted">
          <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
          or
          <span className="h-px flex-1" style={{ background: 'var(--line)' }} />
        </div>

        <button
          type="button"
          onClick={continueWithGoogle}
          disabled={busy || googleBusy}
          className="btn btn-outline w-full"
        >
          <GoogleIcon />
          {googleBusy ? 'Connecting to Google…' : 'Continue with Google'}
        </button>

        <p className="mt-6 text-center text-sm muted">
          New to Kindora?{' '}
          <Link className="font-bold" style={{ color: 'var(--green)' }} href="/register">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.56-5.17 3.56-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
