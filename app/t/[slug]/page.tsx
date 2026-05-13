import { notFound } from "next/navigation";
import Workspace from "@/components/Workspace";
import {
  getTemplate,
  listTemplateKinds,
  type TemplateKind,
} from "@/lib/templates";

// No `generateStaticParams` on purpose: `searchParams.kind` makes the route
// dynamic, and folder vs. web templates already have cheap reads, so SSG would
// only duplicate work for each ?kind= variant.

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
  const template = await getTemplate(params.slug, {
    preferKind: readKind(searchParams),
  });
  if (!template) {
    return { title: "Not found — Dropin" };
  }
  return {
    title: `${template.title} — Dropin`,
    description: template.description,
  };
}

export default async function TemplatePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { kind?: string };
}) {
  const preferKind = readKind(searchParams);
  const [template, availableKinds] = await Promise.all([
    getTemplate(params.slug, { preferKind }),
    listTemplateKinds(params.slug),
  ]);
  if (!template) notFound();

  // `key` forces Workspace to remount when the URL toggle flips kinds, so
  // its `useState(initialCode)` picks up the sibling file's source instead of
  // holding on to the previous variant.
  return (
    <Workspace
      key={`${template.slug}:${template.kind}`}
      initialCode={template.source}
      initialKind={template.kind}
      filename={template.slug}
      title={template.title}
      subtitle={template.category}
      urlKindToggle={availableKinds.length > 1}
    />
  );
}
