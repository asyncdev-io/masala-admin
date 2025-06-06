"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  UtensilsCrossed,
  PlusCircle,
  ClipboardList,
  Settings,
  CookingPot
} from "lucide-react";

const navItems = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Menú",
    href: "/dashboard/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Agregar platillo",
    href: "/dashboard/add",
    icon: PlusCircle,
  },
  {
    title: "Órdenes",
    href: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    title: "Perfil",
    href: "/dashboard/profile",
    icon: Settings,
  },
  {
    title: "Agregar restaurante",
    href: "/dashboard/new-restaurant",
    icon: CookingPot,
  },
];

interface MainNavProps extends React.HTMLAttributes<HTMLDivElement> {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function MainNav({
  className,
  mobile,
  onNavigate,
  ...props
}: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex",
        mobile ? "flex-col space-y-2" : "flex-col gap-2",
        className
      )}
      {...props}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2",
              pathname === item.href && "bg-muted",
              mobile ? "w-full" : "w-full lg:w-auto"
            )}
            asChild
            onClick={onNavigate}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
