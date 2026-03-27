import { statSync } from "node:fs";
import { join } from "node:path";

export function getLoadingAnimationSrc() {
  try {
    const assetPath = join(process.cwd(), "public", "loading.lottie");
    const version = statSync(assetPath).mtimeMs.toString();

    return `/loading.lottie?v=${version}`;
  } catch {
    return "/loading.lottie";
  }
}
