import type { Metadata } from "next";
import ClientsPageExperience from "@/components/ClientsPageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";
import { getMetadataForStaticSlug } from "@/lib/cms-slug-page";

export async function generateMetadata(): Promise<Metadata> {
  return getMetadataForStaticSlug("clients", {
    title: "Our Clients | Tag RoBo Tech",
    description:
      "Discover the enterprises that trust Tag RoBo Tech for asset tracking, RFID reconciliation, fleet monitoring, and robotics-led verification across India.",
  });
}

export default function ClientsPage() {
  return (
    <>
      <SiteNavbar />
      <ClientsPageExperience />
      <Footer />
    </>
  );
}
