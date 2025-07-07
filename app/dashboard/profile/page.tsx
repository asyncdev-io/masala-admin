"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label as UILabel } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  useGetMyRestaurantsQuery,
  useGetRestaurantCategoriesQuery,
  useGetLabelsQuery,
  useUpdateRestaurantMutation,
} from "@/lib/store/api";
import RestaurantForm from "@/components/restaurant-form";

export default function ProfilePage() {
  const selectedRestaurantId = useSelector(
    (state: RootState) => state.restaurant.selectedRestaurant.id
  );
  const { data: restaurants, isLoading, isError } = useGetMyRestaurantsQuery();
  const { data: categories = [] } = useGetRestaurantCategoriesQuery();
  const { data: labels = [] } = useGetLabelsQuery();
  const [updateRestaurant, { isLoading: isUpdating }] = useUpdateRestaurantMutation();
  const selectedRestaurant = restaurants?.find(
    (r) => r.id === selectedRestaurantId
  );

  async function handleSubmit(data: Record<string, any>) {
    if (!selectedRestaurant) return;
    const { getAdminIdFromToken } = await import("@/lib/getAdminIdFromToken");
    const adminId = getAdminIdFromToken();
    if (!adminId) {
      // Aquí puedes mostrar un toast de error: "No se pudo obtener el adminId"
      return;
    }
    try {
      await updateRestaurant({
        adminId,
        id: selectedRestaurant.id,
        data,
      }).unwrap();
      // Aquí puedes mostrar un toast de éxito
    } catch (error) {
      // Aquí puedes mostrar un toast de error
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Perfil del Restaurante</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando...</p>
          ) : isError ? (
            <p>Error al cargar la información del restaurante</p>
          ) : !selectedRestaurant ? (
            <p>No hay restaurante seleccionado</p>
          ) : (
            <RestaurantForm
              initialValues={{
                name: selectedRestaurant.name,
                description: selectedRestaurant.description,
                imageUrl: selectedRestaurant.imageUrl,
                categoryId: selectedRestaurant.category?.id || "",
                labelIds: selectedRestaurant.labelIds || [],
              }}
              categories={categories}
              labels={labels}
              mode="edit"
              isLoading={isUpdating}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}