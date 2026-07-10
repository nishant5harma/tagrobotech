import Image, { type ImageProps } from "next/image";

/**
 * CMS uploads are served from /uploads via the Next.js rewrite, not from /public.
 * Next.js image optimization only works for files in /public, so CMS images must
 * bypass the optimizer.
 */
export default function CmsImage(props: ImageProps) {
  return <Image {...props} unoptimized />;
}
