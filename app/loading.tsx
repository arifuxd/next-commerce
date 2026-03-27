import LoadingAnimation from "@/components/ui/loading-animation";
import { getLoadingAnimationSrc } from "@/lib/loading-animation";

export default function Loading() {
  return <LoadingAnimation src={getLoadingAnimationSrc()} />;
}
