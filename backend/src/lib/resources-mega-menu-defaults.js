import resourcesMegaMenuDefaults from "../../../database/defaults/resources-mega-menu.json" with { type: "json" };

export const RESOURCES_MEGA_MENU_KEY = "resources_mega_menu";

export function defaultResourcesMegaMenuData() {
  return structuredClone(resourcesMegaMenuDefaults);
}
