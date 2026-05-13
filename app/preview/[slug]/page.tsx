import { notFound } from "next/navigation";
import PreviewRoute from "@/components/PreviewRoute";
import { getTemplate, type TemplateKind } from "@/lib/templates";

function readKind(searchParams?: { kind?: string }): TemplateKind {
  return searchParams?.kind === "html" ? "html" : "jsx";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { kind?: string };
}) {
  const t = await getTemplate(params.slug, {
    preferKind: readKind(searchParams),
  });
  return {
    title: t ? `Preview: ${t.title} — Dropin` : "Preview — Dropin",
    // The preview route is a transient, full-bleed render of a single
    // template. Don't dilute search results with N preview pages — the
    // canonical landing for each template is /t/[slug].
    robots: { index: false, follow: true },
  };
}

export default async function FullscreenPreviewPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { kind?: string };
}) {
  const preferKind = readKind(searchParams);
  const template = await getTemplate(params.slug, { preferKind });
  if (!template) notFound();

  return (
    <PreviewRoute
      code={template.source}
      kind={template.kind}
      filename={template.slug}
    />
  );
}
