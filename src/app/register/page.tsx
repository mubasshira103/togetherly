'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) router.replace('/');
  }, [session, isPending, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || password.length < 6) {
      toast.error('Password needs uppercase, lowercase and at least 6 characters');
      return;
    }

    setBusy(true);
    try {
      const r = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image.trim(),
      });

      if (r.error) {
        toast.error(r.error.message || 'Registration failed');
        return;
      }

      toast.success('Account created successfully');
      router.push('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container section max-w-xl">
      <div className="card p-8 md:p-10">
        <span className="eyebrow">Join the movement</span>
        <h1 className="mt-3 text-3xl font-black">Create your account</h1>
        <form onSubmit={submit} className="mt-8 grid gap-4">
          <label className="text-sm font-semibold">
            Full name
            <input
              className="field mt-2"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
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
            Photo URL
            <input
              className="field mt-2"
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </label>
          <label className="text-sm font-semibold">
            Password
            <input
              className="field mt-2"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="mt-1 block text-xs muted">
              At least 6 characters, including uppercase and lowercase letters.
            </span>
          </label>
          <button disabled={busy} className="btn mt-2">
            {busy ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm muted">
          Already registered?{' '}
          <Link className="font-bold" style={{ color: 'var(--green)' }} href="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
