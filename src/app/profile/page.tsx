
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <section className="container section max-w-xl">
        Loading…
      </section>
    );
  }

  if (!session) return null;

  const profileImage = image ?? session.user.image ?? '';

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const imageUrl = String(data.get('image') || '').trim();

    if (!name) {
      toast.error('Please enter your name');
      return;
    }

    setIsSaving(true);

    try {
      const result = await authClient.updateUser({
        name,
        image: imageUrl || undefined,
      });

      if (result.error) {
        toast.error(result.error.message || 'Profile update failed');
      } else {
        toast.success('Profile updated successfully');
        setImage(imageUrl);
        setImageError(false);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="container section max-w-xl">
      <h1 className="text-4xl font-black">Your profile</h1>

      <form onSubmit={save} className="card mt-8 grid gap-4 p-8">

        <div className="flex flex-col items-center gap-3">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100">
            {profileImage && !imageError ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-gray-400">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>

          <p className="text-sm muted">
            Your profile picture
          </p>
        </div>

        <label className="text-sm font-semibold">
          Display name
          <input
            className="field mt-2"
            name="name"
            required
            defaultValue={session.user.name}
          />
        </label>

        <label className="text-sm font-semibold">
          Profile photo URL
          <input
            className="field mt-2"
            name="image"
            type="url"
            value={profileImage}
            onChange={(e) => {
              setImage(e.target.value);
              setImageError(false);
            }}
            placeholder="Enter your image URL"
          />
        </label>

        <p className="text-sm muted">
          {session.user.email}
        </p>

        <button
          type="submit"
          className="btn"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save profile'}
        </button>

      </form>
    </section>
  );
}

