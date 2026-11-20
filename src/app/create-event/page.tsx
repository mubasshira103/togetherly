'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/api';

const MIN_DATE = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

export default function CreateEvent() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Cleanup',
    imageUrl: '',
    location: '',
    eventDate: '',
  });
  useEffect(() => {
    if (!isPending && !session) router.replace('/login');
  }, [isPending, session, router]);
  if (!isPending && !session) return null;
  function change(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (new Date(form.eventDate) <= new Date()) {
      toast.error('Choose a future date and time');
      return;
    }
    setBusy(true);
    try {
      await api('/events', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          eventType: form.type,
          imageURL: form.imageUrl,
          location: form.location,
          eventDate: form.eventDate,
          creatorEmail: session?.user.email,
        }),
      });
      toast.success('Your event has been created');
      router.push('/events');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not create event');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="container section max-w-3xl">
      <span className="eyebrow">Bring people together</span>
      <h1 className="mt-3 text-4xl font-black">Create an event</h1>
      <p className="mt-3 muted">Share an idea and invite your community to take part.</p>
      <form onSubmit={submit} className="card mt-8 grid gap-5 p-7 md:grid-cols-2">
        <label className="text-sm font-semibold md:col-span-2">
          Event title
          <input
            className="field mt-2"
            required
            minLength={5}
            maxLength={100}
            value={form.title}
            onChange={(e) => change('title', e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold">
          Event type
          <select
            className="field mt-2"
            value={form.type}
            onChange={(e) => change('type', e.target.value)}
          >
            {['Cleanup', 'Plantation', 'Donation', 'Education', 'Health', 'Other'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          Event date
          <input
            className="field mt-2"
            type="datetime-local"
            required
            min={MIN_DATE}
            value={form.eventDate}
            onChange={(e) => change('eventDate', e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Thumbnail image URL
          <input
            className="field mt-2"
            type="url"
            required
            value={form.imageUrl}
            onChange={(e) => change('imageUrl', e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Location
          <input
            className="field mt-2"
            required
            value={form.location}
            onChange={(e) => change('location', e.target.value)}
          />
        </label>
        <label className="text-sm font-semibold md:col-span-2">
          Description
          <textarea
            className="field mt-2 min-h-36"
            required
            minLength={20}
            maxLength={2000}
            value={form.description}
            onChange={(e) => change('description', e.target.value)}
          />
        </label>
        <button disabled={busy} className="btn md:col-span-2">
          {busy ? 'Publishing…' : 'Publish event'}
        </button>
      </form>
    </section>
  );
}
