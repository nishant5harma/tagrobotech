import testimonialsDefaults from "../../../database/defaults/testimonials.json" with { type: "json" };

export function defaultTestimonialsSectionData() {
  return structuredClone(testimonialsDefaults);
}
