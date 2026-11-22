import { Users, Leaf, HandHeart } from 'lucide-react';
const features = [
  {
    icon: Users,
    title: 'Find your people',
    desc: 'Meet neighbours who care about the same things you do.',
  },
  {
    icon: Leaf,
    title: 'Make local impact',
    desc: 'Join practical initiatives that improve shared spaces.',
  },
  {
    icon: HandHeart,
    title: 'Give with purpose',
    desc: 'Share skills, time, resources and a little kindness.',
  },
];
export default function WhyKindora() {
  return (
    <section className="section" style={{ background: 'var(--lime)' }} id="impact">
      <div className="container">
        <div className="max-w-xl">
          <span className="eyebrow">Why Kindora</span>

          <h2 className="mt-3 text-4xl font-black">A little time can change a lot.</h2>

          <p className="mt-4 leading-7 muted">
            We make it easier for neighbours to turn good intentions into shared action.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((item) => (
            <div key={item.title} className="rounded-3xl bg-white/70 p-7 text-[#17251f]">
              <item.icon size={28} className="text-[#176b4b]" />

              <h3 className="mt-5 text-xl font-bold">{item.title}</h3>

              <p className="mt-2 text-sm leading-6 text-[#66736c]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
