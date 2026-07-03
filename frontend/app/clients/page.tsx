import type { Metadata } from "next";
import ClientsPageExperience from "@/components/ClientsPageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";

export const metadata: Metadata = {
  title: "Our Clients | Tag RoBo Tech",
  description:
    "Discover the enterprises that trust Tag RoBo Tech for asset tracking, RFID reconciliation, fleet monitoring, and robotics-led verification across India.",
};

export default function ClientsPage() {
  return (
    <>
      <SiteNavbar />
      <ClientsPageExperience />
      <Footer />
    </>
  );
}
