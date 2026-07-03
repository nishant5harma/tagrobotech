import {
  Boxes,
  FileText,
  Home,
  Image,
  KeyRound,
  Menu,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const adminNavItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Pages", href: "/dashboard/pages", icon: FileText },
  { label: "Components", href: "/dashboard/components", icon: Boxes },
  { label: "Navigation", href: "/dashboard/navigation", icon: Menu },
  { label: "Leads", href: "/dashboard/leads", icon: Users },
  { label: "Change Password", href: "/dashboard/change-password", icon: KeyRound },
  { label: "Media", href: "/dashboard/media", icon: Image },
];
