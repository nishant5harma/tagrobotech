import FooterClient from "@/components/FooterClient";
import { getFooterSettings } from "@/lib/site-settings";

export default async function Footer() {
  const settings = await getFooterSettings();
  return <FooterClient settings={settings} />;
}
