import trackDefaults from "../../../database/defaults/track-section.json" with { type: "json" };

export const DEFAULT_TRACK_ITEMS = trackDefaults.items;

export function defaultTrackSectionData() {
  return structuredClone(trackDefaults);
}
