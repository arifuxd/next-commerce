import LoadingAnimation from "@/components/ui/loading-animation";
import { getLoadingAnimationSrc } from "@/lib/loading-animation";

export default function AdminLoading() {
  return <LoadingAnimation src={getLoadingAnimationSrc()} />;
}
