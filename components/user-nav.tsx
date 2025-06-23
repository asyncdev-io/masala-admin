"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Cookies from "js-cookie";
import { Role } from "@/types/roles";
import { useEffect, useState } from "react";

export function UserNav() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    setUserInfo({
      name: Cookies.get("masala-admin-name") || '',
      email: Cookies.get("masala-admin-email") || '',
      role: Cookies.get("masala-admin-role") || '',
    });
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    Cookies.remove("masala-admin-token");
    Cookies.remove("masala-admin-email");
    Cookies.remove("masala-admin-name");
    Cookies.remove("masala-admin-role");
    router.push("/login");
    router.refresh();
  };

  const fallbackLetter = mounted && userInfo.role ?
    (userInfo.role === Role.MANAGER ? 'M' : 'A') :
    '';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{fallbackLetter}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}