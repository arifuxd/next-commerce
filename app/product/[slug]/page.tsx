import { notFound } from "next/navigation";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { LandingHero } from "@/components/landing/landing-hero";
import { MediaSection } from "@/components/landing/media-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { StickyBuyNowBar } from "@/components/landing/sticky-buy-now-bar";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { UrgencyCountdown } from "@/components/landing/urgency-countdown";
import { InlineCheckoutForm } from "@/components/checkout/inline-checkout-form";
import { SiteHeader } from "@/components/ui/site-header";
import { getActiveProductBySlug } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";

interface ProductLandingPageProps {
  params: Promise<{ slug: string }>;
}

const testimonials = [
  {
    name: "Sarah J.",
    role: "Growth Marketer",
    quote: "We saw our conversion rate jump in the first week after implementing this.",
  },
  {
    name: "Nabil R.",
    role: "Founder",
    quote: "The clarity and execution speed this gave our team is unreal.",
  },
  {
    name: "Emily K.",
    role: "Product Lead",
    quote: "Practical and high-impact. No fluff, just outcomes.",
  },
];

export default async function ProductLandingPage({ params }: ProductLandingPageProps) {
  const { slug } = await params;
  const product = await getActiveProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialCustomer = {
    fullName: "",
    email: user?.email ?? "",
    phone: "",
    address: "",
  };

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();

    initialCustomer = {
      fullName: profile?.full_name ?? "",
      email: user.email ?? "",
      phone: profile?.phone ?? "",
      address: "",
    };
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-28 pt-8">
        <LandingHero product={product} />
        <SocialProofSection />
        <BenefitsSection />
        <FeaturesSection />
        <MediaSection imageUrl={product.image_url} title={product.title} />
        <TestimonialsSection testimonials={testimonials} />
        <UrgencyCountdown />
        <PricingSection price={product.price} stockQuantity={product.stock_quantity} />
        <InlineCheckoutForm
          product={{
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
          }}
          initialCustomer={initialCustomer}
        />
      </main>
      <StickyBuyNowBar price={product.price} />
    </>
  );
}
