
"use client";

import React from "react"; // Import React for React.memo
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { doSignOut, auth } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";

function UserNavComponent() {
  const { toast } = useToast();
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  const getInitials = (name?: string | null) => {
    if (!name) return "G"; // Guest initial
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase() || "U"; 
  };
  
  const handleLogout = async () => {
    try {
      await doSignOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/auth/signin'); 
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Logout error:", error);
      }
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log out. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-10 w-10">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" asChild>
          <Link href="/auth/signin">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || currentUser.email || "User"} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(currentUser.displayName || currentUser.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{currentUser.displayName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const UserNav = React.memo(UserNavComponent);
