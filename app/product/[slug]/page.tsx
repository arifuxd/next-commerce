import { notFound } from "next/navigation";
import { ProductLandingPage } from "@/components/landing/saas-product-page";
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
    quote: "We saw better conversion quality right after using this framework.",
  },
  {
    name: "Nabil R.",
    role: "Founder",
    quote: "The structure is clear and practical. Easy to execute.",
  },
  {
    name: "Emily K.",
    role: "Product Lead",
    quote: "Simple, focused, and optimized for action.",
  },
];

export default async function ProductPage({ params }: ProductLandingPageProps) {
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
      <ProductLandingPage product={product} initialCustomer={initialCustomer} testimonials={testimonials} />
    </>
  );
}
