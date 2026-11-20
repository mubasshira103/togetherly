const galleryImages = [
  'photo-1469571486292-0ba58a3f068b',
  'photo-1531206715517-5c0ba140b2b8',
  'photo-1559027615-cd4628902d4a',
  'photo-1593113598332-cd288d649433',
];

export default function GallerySection() {
  return (
    <section id="gallery" className="container section">
      <div className="text-center">
        <span className="eyebrow">Moments that matter</span>

        <h2 className="mt-3 text-4xl font-black">Goodness looks like this.</h2>
      </div>

      <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4">
        {galleryImages.map((id, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={id}
            src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`}
            alt={`Community volunteering moment ${i + 1}`}
            className={`h-48 w-full rounded-2xl object-cover md:h-64 ${
              i === 1 ? 'md:translate-y-6' : ''
            }`}
          />
        ))}
      </div>
    </section>
  );
}
