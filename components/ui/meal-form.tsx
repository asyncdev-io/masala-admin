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
import Loader from "@/components/ui/loader";
import { useGetMenuCategoriesQuery } from "@/lib/store/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useMealForm } from "@/hooks/use-meal-form";

interface MealFormProps {
  mealId?: string | null; // Opcional, si estamos editando
  initialData?: any; // Datos iniciales del platillo para edición
}

export default function MealForm({ mealId, initialData }: MealFormProps) {
  const selectedRestaurantMenuId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.menuId);
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useGetMenuCategoriesQuery(selectedRestaurantMenuId || '', {
    skip: !selectedRestaurantMenuId,
  });

  const {
    mealDetails,
    setMealDetails,
    handleMealDetilChange,
    handleFileChange,
    handleSubmit,
    mealResponse,
    isLoading,
    uploadImgInputRef,
    isEditMode,
  } = useMealForm({ mealId, initialData });

  if (categoriesLoading) return <Loader />; // O un skeleton
  if (categoriesError) return <p className="text-red-500">Error al cargar categorías.</p>;

  const formTitle = isEditMode ? 'Editar platillo' : 'Nuevo platillo';
  const submitButtonText = isEditMode ? 'Actualizar platillo' : 'Agregar platillo';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="dish-name">Nombre</Label>
            <Input
              id="dish-name"
              value={mealDetails.name}
              placeholder="e.g., Classic Burger"
              data-menu-detail-field="name"
              onChange={handleMealDetilChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={mealDetails.category.id}
              onValueChange={(value) => setMealDetails({ ...mealDetails, category: { id: value, name: '', menu: null } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="-1" disabled>No hay categorías disponibles</SelectItem>
                )}
                {!selectedRestaurantMenuId && <SelectItem value="-2" disabled>Define el restaurante</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              value={mealDetails.price}
              placeholder="Coloca el precio"
              data-menu-detail-field="price"
              onChange={handleMealDetilChange}
            />
            <p className="text-sm text-gray-500">
              Nota: Este es el precio que usted recibirá por cada platillo vendido pero la plataforma aplicará comisiones y por ello este precio subirá al cliente final.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dish-image">Imagen</Label>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              id="dish-image" // Renombra para evitar conflicto con 'dish-name'
              placeholder="URL imagen"
              ref={uploadImgInputRef}
              onChange={handleFileChange} // Usa handleFileChange del hook
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={mealDetails.description}
              placeholder="Coloca la descripción del platillo"
              data-menu-detail-field="description"
              onChange={handleMealDetilChange}
            />
          </div>
          <Button type="submit" disabled={isLoading.createMeal || isLoading.updateMeal}>
            {
              isLoading.createMeal ||
                isLoading.updateMeal ?
                <>
                  <Loader size="sm" />
                  Espere...
                </>
                :
                submitButtonText
            }
          </Button>

          {mealResponse.error && <p className="text-red-500">{mealResponse.error}</p>}
          {mealResponse.success && <p className="text-green-500">{mealResponse.success}</p>}
        </form>
      </CardContent>
    </Card>
  );
}