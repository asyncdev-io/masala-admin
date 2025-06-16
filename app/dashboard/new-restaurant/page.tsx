"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { useCreateRestaurantMutation, useGetLabelsQuery, useGetRestaurantCategoriesQuery } from "@/lib/store/api";
import { CreateRestaurantRequest, CreateRestaurantResponse } from "@/types/restaurant";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/ui/loader";

export default function NewRestaurantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [createRestaurant] = useCreateRestaurantMutation();
  const { data: categories } = useGetRestaurantCategoriesQuery();
  const { data: labels } = useGetLabelsQuery();
  const [restaurantDetails, setRestaurantDetails] = useState<CreateRestaurantRequest>({
    name: '',
    description: '',
    imageUrl: '',
    categoryId: '-1',
    email: '',
    labelIds: Array<string>()
  });
  const uploadImgInputRef = useRef<HTMLInputElement>(null);
  const [createRestaurantResponse, setCreateRestaurantResponse] = useState<CreateRestaurantResponse>();

  const handleLabelSelect = (value: string) => {
    if (!selectedLabels.includes(value)) {
      setSelectedLabels([...selectedLabels, value]);
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setSelectedLabels(selectedLabels.filter(label => label !== labelToRemove));
  };

  function handleRestaurantDetilChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { dataset, value } = e.target;
    const field = dataset.restaurantDetailField as keyof CreateRestaurantRequest;
    setRestaurantDetails({
      ...restaurantDetails,
      [field]: value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log(restaurantDetails);
    // Restaurant validations
    if (
      !restaurantDetails.name ||
      !restaurantDetails.description ||
      restaurantDetails.categoryId === '-1' ||
      !restaurantDetails.email ||
      selectedLabels.length === 0
    ) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Todos los campos deben estar llenos",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', restaurantDetails.name);
    formData.append('description', restaurantDetails.description);
    formData.append('imageUrl', '');
    formData.append('categoryId', restaurantDetails.categoryId);
    formData.append('email', restaurantDetails.email);
    formData.append('labelIds', JSON.stringify(selectedLabels));
    formData.append('restaurantImage', uploadImgInputRef.current?.files?.[0] || '');

    try {
      const response = await createRestaurant(formData).unwrap();
      console.log(response);

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
        setRestaurantDetails({
          name: '',
          description: '',
          imageUrl: '',
          categoryId: '-1',
          email: '',
          labelIds: Array<string>()
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se ha podido crear el restaurante",
        });
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
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Restaurante</Label>
              <Input value={restaurantDetails.name} id="name" placeholder="Ingrese el nombre del restaurante" data-restaurant-detail-field="name" onChange={handleRestaurantDetilChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describa su restaurante"
                className="min-h-[100px]"
                data-restaurant-detail-field="description"
                onChange={handleRestaurantDetilChange}
                value={restaurantDetails.description}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen del Restaurante</Label>
              <Input id="image" type="file" accept="image/*" ref={uploadImgInputRef} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={restaurantDetails.categoryId} onValueChange={(value) => setRestaurantDetails({ ...restaurantDetails, categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories && categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input value={restaurantDetails.email} id="email" type="email" placeholder="correo@ejemplo.com" data-restaurant-detail-field="email" onChange={handleRestaurantDetilChange} />
            </div>

            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <Select onValueChange={handleLabelSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Agregar etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  {labels && labels.map((label) => (
                    <SelectItem
                      key={label.id}
                      value={label.id}
                      disabled={selectedLabels.includes(label.id)}
                    >
                      {label.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-2 flex flex-wrap gap-2 border rounded-md p-2 min-h-[50px]">
                {labels && selectedLabels.map((labelValue: string) => {
                  const label = labels.find(l => l.id === labelValue);
                  return (
                    <Badge key={labelValue} variant="secondary" className="flex items-center gap-1">
                      {label?.name}
                      <button
                        type="button"
                        onClick={() => removeLabel(labelValue)}
                        className="hover:bg-gray-200 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader size="sm" />
                  <span className="ml-2">Creando restaurante...</span>
                </>
              ) : (
                "Crear Restaurante"
              )}
            </Button>
            {
              createRestaurantResponse?.warnings?.map((warning) => (
                <p key={warning} className="text-yellow-500 mt-2">{warning}</p>
              ))
            }
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
