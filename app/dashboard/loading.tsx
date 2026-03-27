import LoadingAnimation from "@/components/ui/loading-animation";
import { getLoadingAnimationSrc } from "@/lib/loading-animation";

export default function DashboardLoading() {
  return <LoadingAnimation src={getLoadingAnimationSrc()} />;
}
