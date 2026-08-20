import caseStudyDefaults from "../../../database/defaults/case-study.json" with { type: "json" };

export function defaultCaseStudySectionData() {
  return structuredClone(caseStudyDefaults);
}
