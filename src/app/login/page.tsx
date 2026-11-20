'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (r.error) {
      toast.error(r.error.message || 'Unable to sign in');
      return;
    }
    toast.success('Welcome back!');
    router.push('/');
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button disabled={busy} className="btn mt-2">
            {busy ? 'Signing in…' : 'Login'}
          </button>
        </form>
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
