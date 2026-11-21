import type { ReactNode } from 'react';
import Link from 'next/link';
import { MapPin, CalendarDays, ArrowUpRight } from 'lucide-react';
import type { EventItem } from '@/types';

export type EventCardData = Pick<EventItem, '_id' | 'title' | 'location' | 'eventDate'> & {
  eventType?: string;
  imageURL?: string;
  description?: string;
};

export function EventCard({ event, actions }: { event: EventCardData; actions?: ReactNode }) {
  return (
    <article className="card flex h-full flex-col">
      <div className="relative h-52">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.imageURL} alt={event.title} className="h-full w-full object-cover" />
        {event.eventType && (
          <span
            className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: 'var(--lime)', color: 'var(--green)' }}
          >
            {event.eventType}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{event.title}</h3>
        {event.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 muted">{event.description}</p>
        )}
        <div className="mt-4 grid gap-2 text-xs muted">
          <span className="flex items-center gap-2">
            <MapPin size={14} />
            {event.location}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={14} />
            {new Date(event.eventDate).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-auto pt-5">
          <Link href={`/events/${event._id}`} className="btn btn-outline w-full text-sm">
            View event <ArrowUpRight size={16} />
          </Link>
          {actions && <div className="mt-3 flex gap-2">{actions}</div>}
        </div>
      </div>
    </article>
  );
}
