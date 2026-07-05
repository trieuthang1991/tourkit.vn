import Image from "next/image";
import { SmartLink } from "@/components/smart-link";
import type { SiteContent } from "@/lib/content";

type Props = {
  ctaBand: SiteContent["ctaBand"];
  footer: SiteContent["footer"];
  brand: SiteContent["brand"];
};

export function SiteFooter({ ctaBand, footer, brand }: Props) {
  return (
    <footer>
      {/* Purple CTA band */}
      <section className="relative overflow-hidden bg-[#8169f1] text-white">
        <div className="tk-container relative grid items-center gap-8 py-14 md:grid-cols-2">
          <div>
            <p className="max-w-xl text-[15px] leading-relaxed text-white/90">{ctaBand.text}</p>
            <h2 className="mt-4 text-4xl font-extrabold">{ctaBand.title}</h2>
            <SmartLink data-contact-popup href={ctaBand.buttonHref} className="mt-6 inline-block rounded-full bg-white px-7 py-3 text-[15px] font-semibold text-[#8169f1] transition hover:bg-white/90">
              {ctaBand.buttonText}
            </SmartLink>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image src={ctaBand.image} alt="" width={420} height={420} className="h-auto w-[280px] object-contain md:w-[360px]" />
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="bg-white">
        <div className="tk-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Image src={brand.logoFooter} alt="Tourkit" width={200} height={54} className="h-12 w-auto" />
            <h3 className="mt-5 text-[15px] font-bold text-[#111]">{footer.companyName}</h3>
            <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-[#4b5563]">
              {footer.offices.map((o) => (
                <p key={o.city}>
                  <span className="font-semibold text-[#111]">{o.city}:</span>
                  <br />
                  {o.addr}
                </p>
              ))}
              <p><span className="font-semibold text-[#111]">Hotline:</span> {footer.hotline}</p>
              <p><span className="font-semibold text-[#111]">Email:</span> {footer.email}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <a href={footer.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8169f1] text-white" aria-label="Facebook">f</a>
              <a href={footer.youtube} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8169f1] text-white" aria-label="Youtube">▶</a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[16px] font-bold text-[#111]">DỊCH VỤ</h4>
            <ul className="space-y-3 text-[14px] text-[#4b5563]">
              {footer.serviceLinks.map((l) => (
                <li key={l.label}><SmartLink href={l.href} className="hover:text-[#8169f1]">{l.label}</SmartLink></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[16px] font-bold text-[#111]">THÔNG TIN CHUNG</h4>
            <ul className="space-y-3 text-[14px] text-[#4b5563]">
              {footer.infoLinks.map((l) => (
                <li key={l.label}><SmartLink href={l.href} className="hover:text-[#8169f1]">{l.label}</SmartLink></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#8169f1] py-4 text-center text-[13px] text-white">{footer.copyright}</div>
    </footer>
  );
}
