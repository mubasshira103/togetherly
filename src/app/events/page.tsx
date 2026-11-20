'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { EventCard } from '@/components/event-card';
import type { EventItem } from '@/types';

const TYPES = ['All', 'Cleanup', 'Plantation', 'Donation', 'Education', 'Health', 'Other'];

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');

  useEffect(() => {
    let active = true;
    api<EventItem[]>('/events')
      .then((list) => {
        if (active) setEvents(list);
      })
      .catch(() => {
        if (active) setEvents([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = events.filter(
    (event) =>
      (type === 'All' || event.eventType === type) &&
      `${event.title} ${event.location}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section className="container section">
      <span className="eyebrow">Find your next good thing</span>
      <h1 className="mt-3 text-4xl font-black">Upcoming events</h1>
      <p className="mt-3 muted">
        Discover local initiatives and join hands with your neighbours.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_220px]">
        <input
          className="field"
          placeholder="Search event or location…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
          {TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      {!filtered.length && (
        <p className="py-16 text-center muted">No matching upcoming events found.</p>
      )}
    </section>
  );
}
