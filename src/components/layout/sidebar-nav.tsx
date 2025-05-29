
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import React from "react"; // Import React for React.memo

interface SidebarNavProps {
  items: NavItem[];
}

function SidebarNavComponent({ items }: SidebarNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        
        return (
          <SidebarMenuItem key={index}>
            <Link href={item.disabled ? "#" : item.href} legacyBehavior passHref>
              <SidebarMenuButton
                variant="default"
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  item.disabled && "cursor-not-allowed opacity-50"
                )}
                disabled={item.disabled}
                isActive={isActive}
                tooltip={{ children: item.title, className: "capitalize" }}
              >
                <Icon className="mr-2 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export const SidebarNav = React.memo(SidebarNavComponent);
