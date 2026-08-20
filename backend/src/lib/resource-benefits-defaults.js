import resourceBenefitsDefaults from "../../../database/defaults/resource-benefits.json" with { type: "json" };

export function defaultResourceBenefitsSectionData() {
  return structuredClone(resourceBenefitsDefaults);
}
