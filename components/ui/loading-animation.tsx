"use client";

import dynamic from "next/dynamic";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false },
);

type LoadingAnimationProps = {
  src: string;
};

export default function LoadingAnimation({ src }: LoadingAnimationProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-6">
      <div className="mx-auto w-full max-w-[220px] sm:max-w-[260px]">
        <DotLottieReact
          src={src}
          autoplay
          loop
          className="h-[180px] w-full sm:h-[220px]"
        />
      </div>
    </main>
  );
}
