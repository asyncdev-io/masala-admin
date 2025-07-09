'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import useMenuCategoryForm from "@/hooks/use-menu-category-form";

export default function MenuCategoryForm () {
  const {
    menuName,
    setMenuName,
    menuCategoryResponseMessage,
    isLoading,
    handleCreateMenuCategory,
    selectedRestaurantMenuId
  } = useMenuCategoryForm(); // Usa el hook para obtener la lógica y el estado

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Categoría de Menú</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleCreateMenuCategory}>
          <div className="space-y-2">
            <Label htmlFor="category-name">Nombre de Categoría</Label>
            <Input
              id="category-name"
              value={menuName}
              placeholder="e.g., Main Course"
              onChange={(e) => setMenuName(e.target.value)}
              disabled={!selectedRestaurantMenuId} // Deshabilitar si no hay menú seleccionado
              data-cy="category-name-input"
            />
          </div>
          <Button type="submit" disabled={isLoading.createMenuCategory || !selectedRestaurantMenuId} data-cy="category-create-btn">
            Agregar Categoría
          </Button>
          {isLoading.createMenuCategory && <Loader />}
          {menuCategoryResponseMessage.error && <p className="text-red-500">{menuCategoryResponseMessage.error}</p>}
          {menuCategoryResponseMessage.success && <p className="text-green-500" data-cy="category-success-text">{menuCategoryResponseMessage.success}</p>}
        </form>
      </CardContent>
    </Card>
  );
}