"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";
import { getAdminIdFromToken } from "@/lib/getAdminIdFromToken";

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

  // Estado local para edición
  const [form, setForm] = useState({
    name: selectedRestaurant?.name || "",
    description: selectedRestaurant?.description || "",
    imageUrl: selectedRestaurant?.imageUrl || "",
    categoryId: selectedRestaurant?.category?.id || "",
    labelIds: selectedRestaurant?.labelIds || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setForm((prev: any) => ({ ...prev, labelIds: options }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return;
    const adminId = getAdminIdFromToken();
    if (!adminId) {
      // Aquí puedes mostrar un toast de error: "No se pudo obtener el adminId"
      return;
    }
    try {
      await updateRestaurant({
        adminId,
        id: selectedRestaurant.id,
        data: {
          name: form.name,
          description: form.description,
          imageUrl: form.imageUrl,
          categoryId: form.categoryId,
          labelIds: form.labelIds,
        },
      }).unwrap();
      // Aquí puedes mostrar un toast de éxito
    } catch (error) {
      // Aquí puedes mostrar un toast de error
    }
  };

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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <UILabel htmlFor="name">Nombre de restaurante</UILabel>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <UILabel htmlFor="description">Descripción</UILabel>
                  <Input
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <UILabel htmlFor="imageUrl">Image URL</UILabel>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <UILabel htmlFor="categoryId">Categoría</UILabel>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <UILabel htmlFor="labelIds">Etiquetas</UILabel>
                  <select
                    id="labelIds"
                    name="labelIds"
                    multiple
                    value={form.labelIds}
                    onChange={handleLabelChange}
                    className="w-full border rounded px-2 py-1"
                  >
                    {labels.map((label) => (
                      <option key={label.id} value={label.id}>
                        {label.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Guardando..." : "Guardar"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}