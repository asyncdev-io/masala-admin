"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RestaurantForm from "@/components/restaurant-form";
import { useCreateRestaurantMutation, useGetLabelsQuery, useGetRestaurantCategoriesQuery } from "@/lib/store/api";
import { CreateRestaurantResponse } from "@/types/restaurant";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function NewRestaurantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [createRestaurant] = useCreateRestaurantMutation();
  const { data: categories = [] } = useGetRestaurantCategoriesQuery();
  const { data: labels = [] } = useGetLabelsQuery();
  const [createRestaurantResponse, setCreateRestaurantResponse] = useState<CreateRestaurantResponse>();

  async function handleSubmit(data: Record<string, any> | FormData) {
    setIsLoading(true);
    try {
      if (data instanceof FormData) {
        // Image compression (if file exists)
        if (data.has("restaurantImage")) {
          const file = data.get("restaurantImage") as File;
          if (file && file.size) {
            const imageOptions = { maxWidth: 800, maxHeight: 600 };
            const { imageCompressor } = await import("@/lib/utils/image-compressor");
            const compressedImage = await imageCompressor(file, imageOptions);
            data.set("restaurantImage", compressedImage);
          }
        }
        const response = await createRestaurant(data).unwrap();
        if (response.stripeOnboardingUrl) {
          setCreateRestaurantResponse(response);
          toast({
            title: "Restaurante creado",
            description: "El restaurante se ha creado exitosamente.",
            action: (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.open(response.stripeOnboardingUrl, "_blank", "noopener,noreferrer");
                }}
              >
                Completar registro
              </Button>
            ),
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se ha podido crear el restaurante",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se ha podido crear el restaurante",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <RestaurantForm
            initialValues={{ name: '', description: '', imageUrl: '', categoryId: '-1', email: '', labelIds: [] }}
            categories={categories}
            labels={labels}
            mode="create"
            isLoading={isLoading}
            onSubmit={handleSubmit}
            warnings={createRestaurantResponse?.warnings}
          />
        </CardContent>
      </Card>
    </div>
  );
}
