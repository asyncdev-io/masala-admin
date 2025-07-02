"use client";

import { UserNav } from "@/components/user-nav";
import { Check, ChefHat } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";
import { MainNav } from "@/components/main-nav";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
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
          {selectedRestaurant.name && (
            <div className="flex place-items-center gap-2 text-sm font-bold">
              <span>{selectedRestaurant.name}</span>
              {
                selectedRestaurant.hasCompleteOnboarding ?
                  // Checkmark
                  <span className="bg-green-300 rounded-full p-1"><Check className="h-6 w-6" /></span>
                  :
                  // Button to complete onboarding
                  <Link
                    href={`/onboarding/reauth?restaurantId=${selectedRestaurant.id}`}
                    className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full"
                    data-cy="complete-onboarding-link"
                  >
                    Completar onboarding
                  </Link>
              }
            </div>
          )}
          <div className="flex-1" />
          <MobileNav />
          <div className="flex-1" />
          <UserNav />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}