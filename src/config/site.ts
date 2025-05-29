
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Package, BookOpen, ArrowRightLeft, Users, Store, BarChart, Lightbulb, Briefcase, Settings } from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  sidebarNav: NavItem[];
};

export const siteConfig: SiteConfig = {
  name: "MaliTrack",
  description: "Small-business bookkeeping, inventory, and local networking web app.",
  url: "https://malitrack.example.com", // Replace with your actual URL
  ogImage: "https://malitrack.example.com/og.jpg", // Replace with your actual OG image URL
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Inventory",
      href: "/inventory",
      icon: Package,
    },
    {
      title: "Ledger",
      href: "/ledger",
      icon: BookOpen,
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: ArrowRightLeft,
    },
    {
      title: "Suppliers",
      href: "/suppliers",
      icon: Users,
    },
    {
      title: "Businesses",
      href: "/businesses",
      icon: Store,
    },
    {
      title: "Your Portfolio",
      href: "/portfolio",
      icon: Briefcase,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart,
    },
    {
      title: "AI Business Tips",
      href: "/advice",
      icon: Lightbulb,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ],
};
