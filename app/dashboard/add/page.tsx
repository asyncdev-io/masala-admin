'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import MenuCategoryForm from "@/components/ui/menu-category-form";
import MealForm from "@/components/ui/meal-form";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useSearchParams } from "next/navigation";
import { useGetMealByIdQuery } from "@/lib/store/api";

export default function AddPage() {
  const selectedRestaurantMenuId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.menuId);
  const searchParams = useSearchParams();
  const mealId = searchParams.get('mealId');
  const { data: initialData } = useGetMealByIdQuery(mealId as string);

  console.log(initialData);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agregar platillo y Categoría</h1>
      {
        !selectedRestaurantMenuId && (
          <Button>
            <Link href={'/dashboard'}>
              Define el restuarante
            </Link>
          </Button>
        )
      }
      <div className="grid gap-6 md:grid-cols-2">
        <MenuCategoryForm />
        <MealForm mealId={ selectedRestaurantMenuId && mealId} initialData={ selectedRestaurantMenuId && initialData} />
      </div>
    </div>
  );
}