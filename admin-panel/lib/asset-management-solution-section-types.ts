export type AssetSolutionButton = {
  text: string;
  link: string;
};

export type AssetSolutionFeature = {
  title: string;
  description: string;
};

export type AssetSolutionTab = {
  id: string;
  label: string;
  panel_heading: string;
  panel_description: string;
  features: AssetSolutionFeature[];
  cta_button: AssetSolutionButton;
  image_media_id: string | null;
  image_src: string;
  image_alt: string;
};

export type AssetManagementSolutionSectionData = {
  heading: string;
  heading_accent: string;
  description: string;
  tabs: AssetSolutionTab[];
};
