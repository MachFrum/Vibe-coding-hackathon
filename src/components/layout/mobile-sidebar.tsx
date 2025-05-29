"use client";

import * as React from "react";
import { Menu, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <Mountain className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarNav items={siteConfig.sidebarNav} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}