import featuresMegaMenuDefaults from "../../../database/defaults/features-mega-menu.json" with { type: "json" };

export function defaultFeaturesMegaMenuData() {
  return structuredClone(featuresMegaMenuDefaults);
}
