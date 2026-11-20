'use client';

import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.success('Thanks for joining the Kindora community!');

    e.currentTarget.reset();
  };

  return (
    <section className="container pb-20">
      <div className="rounded-[30px] p-8 md:p-12" style={{ background: '#173e2d', color: 'white' }}>
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#b9e5c8]">
              A note from Kindora
            </span>

            <h2 className="mt-3 text-3xl font-black">Good news belongs to everyone.</h2>

            <p className="mt-3 text-sm leading-7 text-white/70">
              Get occasional updates about new community events and ways to take part.
            </p>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              placeholder="Your email address"
              className="field bg-white text-[#17251f]"
            />

            <button
              type="submit"
              className="btn whitespace-nowrap"
              style={{ background: '#d9efb4', color: '#173e2d' }}
            >
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
