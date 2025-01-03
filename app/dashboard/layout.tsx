"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserNav } from "@/components/user-nav";
import { ChefHat } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { MainNav } from "@/components/main-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden border-r bg-gray-100/40 lg:block lg:w-64">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <ChefHat className="mr-2 h-6 w-6" />
            <span className="font-semibold">Restaurant Admin</span>
          </div>
          <div className="flex-1 p-4">
            <MainNav />
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
          <MobileNav />
          <div className="flex-1" />
          <UserNav />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}