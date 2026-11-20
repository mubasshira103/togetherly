'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { api } from '@/lib/api';
import type { EventItem } from '@/types';
import { EventCard } from '../event-card';

export default function UpcomingEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api<EventItem[]>('/events/recent?limit=6')
      .then((list) => {
        if (active) setEvents(list);
      })
      .catch(() => {
        if (active) setEvents([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Get involved</span>
            <h2 className="mt-3 text-4xl font-black">Coming up near you</h2>
            <p className="mt-3 muted">Fresh opportunities to show up for your community.</p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-bold"
            style={{ color: 'var(--green)' }}
          >
            All events <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="card h-[420px] animate-pulse">
                <div className="h-52 bg-black/10" />
                <div className="p-5">
                  <div className="h-5 w-3/4 rounded bg-black/10" />
                  <div className="mt-4 h-3 rounded bg-black/10" />
                  <div className="mt-3 h-3 w-2/3 rounded bg-black/10" />
                </div>
              </div>
            ))
          ) : events.length ? (
            events.map((event) => <EventCard key={event._id} event={event} />)
          ) : (
            <p className="col-span-full py-10 text-center muted">
              No upcoming events yet. Be the first to create one.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
