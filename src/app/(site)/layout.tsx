import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FloatingButtons } from "@/components/floating-buttons";
import { ContactPopup } from "@/components/contact-popup";
import { VideoPopup } from "@/components/video-popup";
import { ImageLightbox } from "@/components/image-lightbox";
import { PancakeChat } from "@/components/pancake-chat";
import { getSite } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSite();
  return (
    <>
      <SiteHeader
        brand={site.brand}
        contact={site.contact}
        nav={site.nav}
        ctaButton={site.ctaButton}
        serviceMenu={site.serviceMenu}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter ctaBand={site.ctaBand} footer={site.footer} brand={site.brand} />
      <FloatingButtons data={site.floating} />
      <ContactPopup data={site.consult} />
      <VideoPopup />
      <ImageLightbox />
      <PancakeChat enabled={site.chat.enabled} src={site.chat.src} />
    </>
  );
}
