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
import { useGetMealsByRestaurantQuery } from "@/lib/store/api";
import { RootState } from "@/lib/store/store";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function MenuPage() {
  const selectedRestaurantMenuId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.menuId);
  const selectedRestaurantId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.id);
  const { data: categoryMeals } = useGetMealsByRestaurantQuery(selectedRestaurantId as string);
  console.log(categoryMeals);
  const [showModalMenuImport, setShowModalMenuImport] = useState(false);

  return (
    <div className="space-y-6">
      {
        showModalMenuImport && <ModalImportMenu showModalMenuImport={setShowModalMenuImport} />
      }
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Menu Items</h1>
        <Button asChild>
          {
            selectedRestaurantMenuId ?
              <button onClick={() => setShowModalMenuImport(true)} data-cy="import-menu-btn">
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
        {/* Travel through categories */}
        {
          categoryMeals && categoryMeals.map((item) => (
            <Accordion type="single" collapsible key={item.categoryName}>
              <AccordionItem value={item.categoryName}>
                <AccordionTrigger>{item.categoryName}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {item.meals.map((meal) => (
                      <Card key={meal.id}>
                        <CardHeader>
                          <CardTitle>{meal.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {meal.description}
                          </p>
                          <p className="font-bold">{meal.price}</p>
                          <Button>
                            <Link href={`/dashboard/add?mealId=${meal.id}`}>Editar producto</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))
        }
        {
          !selectedRestaurantId && (
            <Card>
              <CardHeader>
                <CardTitle>No ha seleccionado un restaurante</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Seleccione un restaurante para ver sus platillos
                </p>
              </CardContent>
            </Card>
          )
        }
        {
          (selectedRestaurantId && !categoryMeals || categoryMeals?.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle>No hay platillos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Aun no has agregado platillos a tu menu
                </p>
              </CardContent>
            </Card>
          )
        }
        {/* {categoryMeals && categoryMeals.map((item) => (
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
        ))} */}
      </div>
    </div>
  );
}