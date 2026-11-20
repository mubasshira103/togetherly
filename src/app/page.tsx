import GallerySection from "@/components/home/gallery-section";
import HeroSection from "@/components/home/hero-section";
import NewsletterSection from "@/components/home/newsletter-section";
import WhyKindora from "@/components/home/why-kindora";

export default function Home() {
  return (
  <>
      <HeroSection />

      <WhyKindora />

      {/* <UpcomingEvents /> */}

      <GallerySection />

      <NewsletterSection />
    </>
  );
}
