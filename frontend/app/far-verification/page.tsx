import type { Metadata } from "next";
import FarVerificationPageExperience from "@/components/FarVerificationPageExperience";
import Footer from "@/components/Footer";
import SiteNavbar from "@/components/SiteNavbar";

export const metadata: Metadata = {
  title: "FAR Verification & Fixed Asset Audit | Tag RoBo Tech",
  description:
    "India's leading Fixed Asset Register (FAR) verification company offering physical asset audit, QR/RFID tagging, FAR reconciliation and PAN India execution for enterprises.",
  alternates: {
    canonical: "/far-verification",
  },
};

export default function FarVerificationPage() {
  return (
    <>
      <SiteNavbar />
      <FarVerificationPageExperience />
      <Footer />
    </>
  );
}
