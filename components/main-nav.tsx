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
  CookingPot,
  LucideProps,
  Banknote
} from "lucide-react";
import { Role } from "@/types/roles";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import Cookie from "js-cookie";

const navItems: {title: string, href: string, icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>, role: Role}[] = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: Home,
    role: Role.ADMIN
  },
  {
    title: "Menú",
    href: "/dashboard/menu",
    icon: UtensilsCrossed,
    role: Role.ADMIN
  },
  {
    title: "Agregar platillo",
    href: "/dashboard/add",
    icon: PlusCircle,
    role: Role.ADMIN
  },
  {
    title: "Órdenes",
    href: "/dashboard/orders",
    icon: ClipboardList,
    role: Role.ADMIN
  },
  {
    title: "Perfil",
    href: "/dashboard/profile",
    icon: Settings,
    role: Role.ADMIN
  },
  {
    title: "Agregar restaurante",
    href: "/dashboard/new-restaurant",
    icon: CookingPot,
    role: Role.ADMIN
  },
  {
    title: "Pagos pendientes",
    href: "/dashboard/manager",
    icon: Banknote,
    role: Role.MANAGER
  }
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
  const role = Cookie.get("masala-admin-role") as Role;

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
        if (item.role !== role) {
          return null;
        }
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
