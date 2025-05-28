"use client"

import ModalImportMenu from "@/components/modal-import-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from "@/lib/store/store";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";

const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and special sauce",
    price: "$12.99",
    category: "Main Course",
  },
  {
    id: 2,
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan and croutons",
    price: "$8.99",
    category: "Starters",
  },
];

export default function MenuPage() {
  const selectedRestaurantMenuId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.menuId);
  const [showModalMenuImport, setShowModalMenuImport] = useState(false);

  return (
    <div className="space-y-6">
      {
        showModalMenuImport && <ModalImportMenu showModalMenuImport={setShowModalMenuImport}/>
      }
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Menu Items</h1>
        <Button asChild>
          {
            selectedRestaurantMenuId ?
            <button onClick={() => setShowModalMenuImport(true)}>
              Importe un menu de otro restaurante
            </button>
            :
            <Link href={'/dashboard'}>
              Defina el resutarante que quiere administrar para importar un menu
            </Link>
          }
        </Button>
        <Button asChild>
          <Link href="/dashboard/add">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Platillo
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>
              <p className="font-bold">{item.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}