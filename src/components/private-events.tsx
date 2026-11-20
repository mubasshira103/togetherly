'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/api';
import type { EventItem, JoinedEvent } from '@/types';
import { EventCard, type EventCardData } from './event-card';

export function PrivateEvents({ mode }: { mode: 'joined' | 'manage' }) {
  const { data: session, isPending } = authClient.useSession();
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace('/login');
      return;
    }

    let active = true;
    const email = session.user.email.toLowerCase();

    const request =
      mode === 'joined'
        ? api<JoinedEvent[]>(`/joins?email=${encodeURIComponent(email)}`).then((joins) =>
            joins.map((join) => ({
              _id: join.eventId,
              title: join.eventTitle,
              location: join.location,
              eventDate: join.eventDate,
              imageURL: join.eventImage,
            }))
          )
        : api<EventItem[]>('/events').then((list) =>
            list.filter((event) => event.creatorEmail?.toLowerCase() === email)
          );

    request
      .then((list) => {
        if (active) setEvents(list);
      })
      .catch((error) => {
        if (active) toast.error(error instanceof Error ? error.message : 'Unable to load events');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session, isPending, mode, router]);

  async function remove(id: string) {
    if (!confirm('Delete this event permanently?')) return;
    try {
      await api(`/events/${id}`, { method: 'DELETE' });
      toast.success('Event deleted');
      setEvents((value) => value.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Delete failed');
    }
  }

  if (isPending || loading) {
    return <section className="container section">Loading your events…</section>;
  }

  return (
    <section className="container section">
      <span className="eyebrow">Your Kindora space</span>
      <h1 className="mt-3 text-4xl font-black">
        {mode === 'joined' ? 'Events you joined' : 'Manage your events'}
      </h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event._id}>
            <EventCard event={event} />
            {mode === 'manage' && (
              <div className="mt-2 flex gap-2">
                <button
                  className="btn btn-outline flex-1"
                  onClick={() => router.push(`/manage-events/${event._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn flex-1"
                  style={{ background: '#b43d3d' }}
                  onClick={() => remove(event._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!events.length && <p className="py-14 text-center muted">Nothing here yet.</p>}
    </section>
  );
}
