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
import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";
import Cookie from "js-cookie";

const navItems: { title: string, href: string, icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>, role: Role }[] = [
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
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [mounted, setMounted] = useState(false);
  const role = Cookie.get("masala-admin-role") as Role;

  // Para que se inicilice el componente y se obtenga la cookie del lado del cliente
  useEffect(() => {
    const roleFromCookie = Cookie.get("masala-admin-role") as Role;
    setUserRole(roleFromCookie);
    setMounted(true);
  }, []);

  // Filtrar los elementos del menú según el rol del usuario
  const renderedNavItems = mounted
    ? navItems.filter((item) => item.role === userRole)
    : [];

  return (
    <nav
      className={cn(
        "flex",
        mobile ? "flex-col space-y-2" : "flex-col gap-2",
        className
      )}
      {...props}
    >
      {renderedNavItems.map((item) => {
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
            <Link href={item.href} data-cy={`main-nav-${item.title.replaceAll(' ', '-').toLowerCase()}`}>
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
