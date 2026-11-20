
import Link from 'next/link';
import { ArrowRight, HeartHandshake } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="container grid items-center gap-10 py-14 md:grid-cols-[1.02fr_.98fr] md:py-20">
      {/* Left Side */}
      <div>
        <span className="eyebrow">Good things happen together</span>

        <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">
          Make room for{' '}
          <span style={{ color: 'var(--green)' }}>good</span> in your neighbourhood.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 muted">
          From planting trees to sharing warm clothes, discover local moments where your time can
          make a real difference.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/events" className="btn">
            Explore events <ArrowRight size={17} />
          </Link>

          <Link href="/create-event" className="btn btn-outline">
            Start an initiative
          </Link>
        </div>

        <div className="mt-10 flex gap-8">
          <div>
            <b className="text-2xl">Local</b>
            <p className="text-xs muted">People-powered</p>
          </div>

          <div>
            <b className="text-2xl">Together</b>
            <p className="text-xs muted">Stronger communities</p>
          </div>

          <div>
            <b className="text-2xl">Impact</b>
            <p className="text-xs muted">One action at a time</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=85"
          alt="Volunteers working together"
          className="h-[420px] w-full rounded-[34px] object-cover md:h-[540px]"
        />

        <div
          className="absolute -bottom-5 -left-4 max-w-[230px] rounded-2xl p-4 shadow-xl"
          style={{ background: 'var(--card)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="rounded-full p-2"
              style={{ background: 'var(--lime)', color: 'var(--green)' }}
            >
              <HeartHandshake size={19} />
            </span>

            <b className="text-sm">Your next good day starts here.</b>
          </div>

          <p className="mt-2 text-xs muted">
            Find a cause close to your heart.
          </p>
        </div>
      </div>
    </section>
  );
}
