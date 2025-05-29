'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";
import { useCreateMenuCategoryMutation } from "@/lib/store/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import Link from "next/link";

export default function AddPage() {
  const menuNameRef = useRef<string>('');
  const [menuCategoryResponseMessage, setMenuCategoryResponseMessage] = useState({
    error: '',
    success: ''
  });
  const selectedRestaurantMenuId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.menuId);
  const [createMenuCategory] = useCreateMenuCategoryMutation();

  async function handleCreateMenuCategory(e: React.FormEvent) {
    e.preventDefault();

    if (menuNameRef.current.length === 0) {
      setMenuCategoryResponseMessage({
        ...menuCategoryResponseMessage,
        error: 'El nombre de la categoría es requerido',
      });
      return;
    }
    if (selectedRestaurantMenuId === null) {
      setMenuCategoryResponseMessage({
        ...menuCategoryResponseMessage,
        error: 'Defina un restuarante para agregar esta categoría',
      });
      return;
    }

    const result = await createMenuCategory({
      name: menuNameRef.current,
      menuId: selectedRestaurantMenuId,
    }).unwrap();

    console.log(result);

    if (!result.success) {
      setMenuCategoryResponseMessage({
        ...menuCategoryResponseMessage,
        error: result.message,
      });
    } else {
      setMenuCategoryResponseMessage({
        ...menuCategoryResponseMessage,
        success: result.message,
      });
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agregar platillo</h1>
      {
        !selectedRestaurantMenuId && <Button>
          <Link href={'/dashboard'}>
            Defina el restuarante
          </Link>
        </Button>
      }
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Categoría de Menú</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleCreateMenuCategory}>
              <div className="space-y-2">
                <Label htmlFor="category-name">Nombre de Categoría</Label>
                <Input id="category-name" placeholder="e.g., Main Course" onChange={(e) => menuNameRef.current = e.target.value} />
              </div>
              <Button type="submit">Agregar Categoría</Button>
              {menuCategoryResponseMessage.error && <p className="text-red-500">{menuCategoryResponseMessage.error}</p>}
              {menuCategoryResponseMessage.success && <p className="text-green-500">{menuCategoryResponseMessage.success}</p>}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo platillo</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dish-name">Nombre</Label>
                <Input id="dish-name" placeholder="e.g., Classic Burger" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Course</SelectItem>
                    <SelectItem value="starter">Starters</SelectItem>
                    <SelectItem value="dessert">Desserts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Coloca el precio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dish-name">URL imagen</Label>
                <Input id="dish-name" placeholder="URL imagen" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Coloca la descripción del platillo"
                />
              </div>
              <Button type="submit">Agregar platillo</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
