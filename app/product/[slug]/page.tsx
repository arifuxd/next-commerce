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
    name: "সারা জে.",
    role: "গ্রোথ মার্কেটার",
    quote: "এটি ব্যবহার করার প্রথম সপ্তাহেই আমাদের কনভার্সন রেট বেড়ে যায়।",
  },
  {
    name: "নাবিল আর.",
    role: "প্রতিষ্ঠাতা",
    quote: "এটি আমাদের টিমকে যে স্বচ্ছতা আর কাজের গতি দিয়েছে, তা সত্যিই অসাধারণ।",
  },
  {
    name: "এমিলি কে.",
    role: "প্রোডাক্ট লিড",
    quote: "খুবই ব্যবহারিক এবং দারুণ কার্যকর। অপ্রয়োজনীয় কিছু নেই, আছে শুধু ফলাফল।",
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
