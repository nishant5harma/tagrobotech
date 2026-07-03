import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeroSection from "@/components/PageHeroSection";
import SiteNavbar from "@/components/SiteNavbar";
import { DEFAULT_PAGE_HERO_SECTION } from "@/lib/page-hero-section";

export const metadata: Metadata = {
  title: "Manufacturing | Solutions | Tag RoBo Tech",
  description:
    "Optimize manufacturing efficiency with smart asset management — real-time visibility, predictive maintenance, and compliance across production lines.",
};

export default function SolutionHeroTestPage() {
  return (
    <>
      <SiteNavbar />
      <main className="overflow-hidden bg-white pt-[108px]">
        <PageHeroSection data={DEFAULT_PAGE_HERO_SECTION} />

        <section className="border-t border-neutral-100 bg-[#f8fafc] py-16">
          <div className="mx-auto w-[min(92%,900px)] px-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f97316]">
              Test page
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#0f2744]">
              Solution page hero preview
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-neutral-600">
              This is a static preview for the dynamic solution page template. Once approved,
              we will connect this hero to the CMS so each solution page can be edited from the
              admin panel.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
