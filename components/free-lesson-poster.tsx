import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandPlaceholder } from "@/components/brand";
export function FreeLessonPoster() {
  return (
    <div className="free-lesson-poster">
      <BrandPlaceholder variant="session" />
      <Link className="site-button" href="/free/#first-lesson">
        Открыть первый бесплатный урок <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
