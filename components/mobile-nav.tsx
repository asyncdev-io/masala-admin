"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChefHat } from "lucide-react";
import { MainNav } from "./main-nav";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ChefHat className="h-6 w-6" />
            <span>Restaurant Admin</span>
          </SheetTitle>
        </SheetHeader>
        <MainNav mobile onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}