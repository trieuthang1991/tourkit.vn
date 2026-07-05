"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content";

type Props = {
  brand: SiteContent["brand"];
  contact: SiteContent["contact"];
  nav: SiteContent["nav"];
  ctaButton: SiteContent["ctaButton"];
  serviceMenu: SiteContent["serviceMenu"];
};

export function SiteHeader({ brand, contact, nav, ctaButton, serviceMenu }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top contact bar */}
      <div className="hidden bg-[#8169f1] text-white lg:block">
        <div className="tk-container flex h-9 items-center justify-end gap-6 text-[13px]">
          <span className="flex items-center gap-2"><i className="opacity-80">✉</i> {contact.email}</span>
          <span className="flex items-center gap-2"><i className="opacity-80">☎</i> {contact.phone}</span>
          <span className="flex items-center gap-2"><i className="opacity-80">📍</i> {contact.address}</span>
        </div>
      </div>

      {/* Main nav */}
      <div className={`bg-white transition-shadow ${scrolled ? "shadow-[0_6px_24px_rgba(0,0,0,0.08)]" : "shadow-[0_1px_0_rgba(0,0,0,0.06)]"}`}>
        <div className="tk-container flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src={brand.logo} alt="Tourkit" width={185} height={50} priority className="h-11 w-auto" />
          </Link>

          <nav className="hidden items-center gap-7 text-[15px] font-medium text-[#111] lg:flex">
            <div className="relative" onMouseEnter={() => setSvcOpen(true)} onMouseLeave={() => setSvcOpen(false)}>
              <button className="flex items-center gap-1 py-6 hover:text-[#8169f1]">
                Dịch Vụ <span className="text-[10px]">▼</span>
              </button>
              {svcOpen && (
                <div className="absolute left-1/2 top-full w-[760px] -translate-x-1/2 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                  <div className="grid grid-cols-3 gap-6">
                    {serviceMenu.map((g) => (
                      <div key={g.heading}>
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[#8169f1]">{g.heading}</p>
                        <ul className="space-y-3">
                          {g.items.map((it) => (
                            <li key={it.title}>
                              <Link href={it.href} className="group flex gap-3">
                                <Image src={it.icon} alt="" width={36} height={36} className="mt-0.5 h-9 w-9 shrink-0 object-contain" />
                                <span>
                                  <span className="block text-[14px] font-semibold text-[#111] group-hover:text-[#8169f1]">{it.title}</span>
                                  <span className="block text-[12px] leading-snug text-[#6b7280]">{it.desc}</span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="py-6 hover:text-[#8169f1]">{n.label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link data-contact-popup href={ctaButton.href} className="hidden rounded-full bg-[#ff6400] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#ff5600] lg:inline-block">
              {ctaButton.label}
            </Link>
            <button className="lg:hidden" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
              <span className="block text-2xl">☰</span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-black/5 bg-white lg:hidden">
            <div className="tk-container flex flex-col py-4 text-[15px] font-medium">
              <Link href="/dich-vu" className="py-2.5" onClick={() => setMobileOpen(false)}>Dịch Vụ</Link>
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="py-2.5" onClick={() => setMobileOpen(false)}>{n.label}</Link>
              ))}
              <Link data-contact-popup href={ctaButton.href} className="mt-2 rounded-full bg-[#ff6400] px-5 py-2.5 text-center text-white" onClick={() => setMobileOpen(false)}>
                {ctaButton.label}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
