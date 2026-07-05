import Script from "next/script";

export function PancakeChat({ enabled, src }: { enabled: boolean; src: string }) {
  if (!enabled || !src) return null;
  return <Script src={src} strategy="afterInteractive" />;
}
