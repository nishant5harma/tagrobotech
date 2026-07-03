import type { Metadata } from "next";
import ContactPageExperience from "@/components/ContactPageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";

export const metadata: Metadata = {
  title: "Contact Us | Tag RoBo Tech",
  description:
    "Get in touch with Tag RoBo Tech — head office in Sector-65 Gurugram, R&D in Udyog Vihar. Sales: +91 9319013339 | Partners: +91 9818883697.",
};

export default function ContactPage() {
  return (
    <>
      <SiteNavbar />
      <ContactPageExperience />
      <Footer />
    </>
  );
}
