"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mentorshipRequest, type MentorshipConfig } from "@/lib/mentorship";
import { LegalDocumentView } from "./legal-document";

export function MentorshipLegalPage({ kind }: { kind: "offer" | "privacy" }) {
  const [config, setConfig] = useState<MentorshipConfig | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    mentorshipRequest<MentorshipConfig>("mentorship_config")
      .then((data) => {
        if (active) setConfig(data);
      })
      .catch((reason) => {
        if (active) setError(reason.message);
      });
    return () => {
      active = false;
    };
  }, []);
  const document = config?.documents?.[kind];
  return (
    <div className="checkout-legal-page site-container">
      <Link href="/mentorship/buy/" className="site-text-link">
        Вернуться к оформлению
      </Link>
      <h1>{kind === "offer" ? "Условия менторства" : "Обработка данных"}</h1>
      {document ? (
        <LegalDocumentView document={document} />
      ) : (
        <p role="status">
          {error || config?.message || "Загружаем актуальные условия…"}
        </p>
      )}
    </div>
  );
}
