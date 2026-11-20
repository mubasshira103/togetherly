'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import type { EventItem } from '@/types';

const TYPES = ['Cleanup', 'Plantation', 'Donation', 'Education', 'Health', 'Other'];

function toLocalInputValue(iso: string) {
  const date = new Date(iso);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default function EditEventPage() {
  return (
    <Suspense fallback={<section className="container section">Loading…</section>}>
      <EditEvent />
    </Suspense>
  );
}

function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) router.replace('/login');
    if (!session) return;

    let active = true;
    api<EventItem>(`/events/${id}`)
      .then((data) => {
        if (active) setEvent(data);
      })
      .catch(() => {
        if (active) toast.error('Unable to load event');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [session, isPending, id, router]);

  function set(key: 'title' | 'description' | 'eventType' | 'imageURL' | 'location' | 'eventDate', value: string) {
    setEvent((previous) => (previous ? { ...previous, [key]: value } : previous));
  }

  async function submit(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    if (!event) return;
    if (new Date(event.eventDate) <= new Date()) {
      toast.error('Event date must be in the future');
      return;
    }
    try {
      await api(`/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          imageURL: event.imageURL,
          location: event.location,
          eventDate: event.eventDate,
        }),
      });
      toast.success('Event updated');
      router.push('/manage-events');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed');
    }
  }

  if (loading) {
    return <section className="container section">Loading…</section>;
  }

  if (!event) {
    return (
      <section className="container section">
        <p className="muted">This event could not be loaded.</p>
        <button className="btn btn-outline mt-6" onClick={() => router.push('/manage-events')}>
          Back to my events
        </button>
      </section>
    );
  }

  return (
    <section className="container section max-w-3xl">
      <h1 className="text-4xl font-black">Update event</h1>
      <form onSubmit={submit} className="card mt-8 grid gap-4 p-7">
        <input
          className="field"
          required
          value={event.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Title"
        />
        <select
          className="field"
          value={event.eventType}
          onChange={(e) => set('eventType', e.target.value)}
        >
          {TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input
          className="field"
          required
          type="url"
          value={event.imageURL}
          onChange={(e) => set('imageURL', e.target.value)}
          placeholder="Image URL"
        />
        <input
          className="field"
          required
          value={event.location}
          onChange={(e) => set('location', e.target.value)}
          placeholder="Location"
        />
        <input
          className="field"
          required
          type="datetime-local"
          value={toLocalInputValue(event.eventDate)}
          onChange={(e) => set('eventDate', e.target.value)}
        />
        <textarea
          className="field min-h-36"
          required
          value={event.description}
          onChange={(e) => set('description', e.target.value)}
        />
        <button className="btn">Save changes</button>
      </form>
    </section>
  );
}
