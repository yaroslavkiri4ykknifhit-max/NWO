"use client";
import { useEffect } from "react";
import { BrandIdentity } from "@/components/brand";

/** Kept under the existing export so callers retain the same loading contract. */
export function GothicHandwrittenLoader({
  onComplete,
  loop = true,
}: {
  onComplete?: () => void;
  loop?: boolean;
}) {
  useEffect(() => {
    if (loop || !onComplete) return;
    const timeout = window.setTimeout(onComplete, 1400);
    return () => window.clearTimeout(timeout);
  }, [loop, onComplete]);
  return (
    <div className="brand-loader" role="status" aria-live="polite">
      <div className="brand-mark">
        <BrandIdentity />
      </div>
      <div className="brand-loader-track" aria-hidden="true">
        <span />
      </div>
      <p>Открываем New Way Out</p>
    </div>
  );
}
