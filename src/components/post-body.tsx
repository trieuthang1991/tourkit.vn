export function PostBody({ html }: { html: string }) {
  return <div className="tk-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
