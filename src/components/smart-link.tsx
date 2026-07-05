import Link from "next/link";
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<typeof Link>;

/** File extensions that should open in a new tab (downloads/documents). */
const FILE_RE = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|csv|txt)(\?|#|$)/i;

/**
 * Drop-in replacement for next/link that opens links in a new tab
 * (target="_blank" + rel="noopener noreferrer") when they either point outside
 * the site OR download a file (PDF, doc, xls, zip…). This keeps the Tourkit tab
 * alive when a visitor follows an outbound link or opens a document.
 * Internal page links keep client-side navigation via next/link.
 */
export function SmartLink({ href, children, ...props }: LinkProps) {
  const url = typeof href === "string" ? href : "";
  const isExternal = /^https?:\/\//i.test(url);
  const isFile = FILE_RE.test(url);

  if (isExternal || isFile) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...(props as ComponentProps<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
