import { UserNav } from "@/components/layout/user-nav";
import { MobileSidebar } from "./mobile-sidebar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-none px-4 sm:px-6 lg:px-8">
        <div className="md:hidden">
          <MobileSidebar />
        </div>
        <div className="hidden md:flex">
          {/* Placeholder for breadcrumbs or page title if needed */}
        </div>
        <div className="flex items-center space-x-4">
          {/* Add any other header items here, like notifications */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}