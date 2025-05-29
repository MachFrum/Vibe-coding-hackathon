
"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";
import { UserNav } from "@/components/layout/user-nav";
import { Mountain, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext"; 
import { BusinessProvider } from "@/contexts/BusinessContext";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !currentUser && !pathname.startsWith('/auth')) {
      // Only redirect if not already on an auth page and not the root (if public)
      // For this app, (app) layout implies authenticated routes.
      router.replace('/auth/signin');
    }
  }, [currentUser, loading, router, pathname]);

  if (loading || (!currentUser && !pathname.startsWith('/auth'))) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading MaliTrack...</p>
      </div>
    );
  }
  
  return (
    <ThemeProvider>
      <BusinessProvider>
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon" variant="sidebar" side="left">
            <SidebarHeader className="p-4">
              <div className="flex items-center justify-between">
                 <Link href="/dashboard" className="flex items-center gap-2 group-data-[[data-collapsible=icon]]:hidden">
                    <Mountain className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold text-foreground">{siteConfig.name}</span>
                  </Link>
                  <Link href="/dashboard" className="hidden items-center gap-2 group-data-[[data-collapsible=icon]]:flex">
                     <Mountain className="h-7 w-7 text-primary" />
                  </Link>
                <div className="group-data-[[data-collapsible=icon]]:hidden">
                  <SidebarTrigger />
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-2 pr-0">
              <SidebarNav items={siteConfig.sidebarNav} />
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[[data-collapsible=icon]]:hidden">
              <UserNav />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </BusinessProvider>
    </ThemeProvider>
  );
}
