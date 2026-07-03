import Navbar from "@/components/Navbar";
import { getAllMegaMenus } from "@/lib/cms";
import { mergeMegaMenuData, type MegaMenuKind } from "@/lib/mega-menu";

export default async function SiteNavbar() {
  const menus = await getAllMegaMenus();

  const megaMenus = {
    resources: mergeMegaMenuData(menus.resources, "resources"),
    features: mergeMegaMenuData(menus.features, "features"),
    solutions: mergeMegaMenuData(menus.solutions, "solutions"),
  } satisfies Record<MegaMenuKind, ReturnType<typeof mergeMegaMenuData>>;

  return <Navbar megaMenus={megaMenus} />;
}
