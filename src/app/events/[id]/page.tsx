'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CalendarDays, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import type { EventItem } from '@/types';

export default function EventDetailsPage() {
  return (
    <Suspense
      fallback={
        <section className="container section">
          <p className="muted">Loading event details…</p>
        </section>
      }
    >
      <EventDetails />
    </Suspense>
  );
}

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    api<EventItem>(`/events/${id}`)
      .then((data) => {
        if (active) setEvent(data);
      })
      .catch(() => {
        if (active) setEvent(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function join() {
    if (!session) {
      toast.error('Please login to join this event');
      router.push('/login');
      return;
    }
    setBusy(true);
    try {
      await api(`/events/${id}/join`, { method: 'POST' });
      toast.success('You joined this event!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not join event');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <section className="container section">
        <p className="muted">Loading event details…</p>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="container section">
        <p className="muted">This event could not be found.</p>
        <Link href="/events" className="btn btn-outline mt-6">
          Back to events
        </Link>
      </section>
    );
  }

  return (
    <section className="container section max-w-4xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.imageURL}
        alt={event.title}
        className="h-[360px] w-full rounded-3xl object-cover"
      />
      <span className="eyebrow mt-8 block">{event.eventType}</span>
      <h1 className="mt-3 text-4xl font-black">{event.title}</h1>
      <div className="mt-5 flex flex-wrap gap-5 text-sm muted">
        <span className="flex items-center gap-2">
          <MapPin size={16} />
          {event.location}
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays size={16} />
          {new Date(event.eventDate).toLocaleString()}
        </span>
      </div>
      <p className="mt-8 whitespace-pre-wrap leading-8 muted">{event.description}</p>
      <button onClick={join} disabled={busy} className="btn mt-8">
        {busy ? 'Joining…' : 'Join this event'}
      </button>{' '}
      <Link href="/events" className="btn btn-outline ml-2">
        Back to events
      </Link>
    </section>
  );
}
