'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) router.replace('/login');
  }, [session, isPending, router]);

  if (isPending) return <section className="container section max-w-xl">Loading…</section>;
  if (!session) return null;

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const image = String(data.get('image') || '').trim();
    const result = await authClient.updateUser({ name, image: image || undefined });
    if (result.error) toast.error(result.error.message || 'Profile update failed');
    else toast.success('Profile updated');
  }

  return (
    <section className="container section max-w-xl">
      <h1 className="text-4xl font-black">Your profile</h1>
      <form onSubmit={save} className="card mt-8 grid gap-4 p-8">
        <label className="text-sm font-semibold">
          Display name
          <input className="field mt-2" name="name" required defaultValue={session.user.name} />
        </label>
        <label className="text-sm font-semibold">
          Profile photo URL
          <input
            className="field mt-2"
            name="image"
            type="url"
            defaultValue={session.user.image || ''}
          />
        </label>
        <p className="text-sm muted">{session.user.email}</p>
        <button className="btn">Save profile</button>
      </form>
    </section>
  );
}
