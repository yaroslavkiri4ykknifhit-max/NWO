import type { LegalDocument } from "@/lib/mentorship";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <article className="checkout-legal-document">
      <p className="site-eyebrow">Редакция {document.version}</p>
      {document.sections.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
