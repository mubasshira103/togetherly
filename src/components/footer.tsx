import Link from 'next/link';
import { HeartHandshake, ArrowUpRight } from 'lucide-react';
export function Footer() {
  return (
    <footer style={{ background: '#10271d', color: '#f3f8f3' }} className="mt-10">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-black">
            <HeartHandshake />
            kindora.
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">
            Small acts, shared together, create meaningful change. Find your people and make your
            community stronger.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Explore</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/65">
            <Link href="/events">Upcoming events</Link>
            <Link href="/create-event">Create an event</Link>
            <Link href="/#impact">Our impact</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Stay connected</h3>
          <p className="mt-4 text-sm text-white/65">
            Have an idea for your community? We would love to hear about it.
          </p>
          <a
            href="mailto:hello@kindora.community"
            className="mt-3 inline-flex items-center gap-2 text-sm"
          >
            hello@kindora.community <ArrowUpRight size={15} />
          </a>
          <div className="mt-5 flex gap-3"></div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/50">
        © 2026 Kindora. Made for communities, with care.
      </div>
    </footer>
  );
}
