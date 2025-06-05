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
import { useCreateMealMutation, useCreateMenuCategoryMutation, useGetMenuCategoriesQuery } from "@/lib/store/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import Link from "next/link";
import { CreateMealRequest } from "@/types/meal";
import Loader from "@/components/ui/loader";

export default function AddPage() {
  const [menuName, setMenuName] = useState('');
  const [menuCategoryResponseMessage, setMenuCategoryResponseMessage] = useState({
    error: '',
    success: ''
  });
  const [mealResponse, setMealResponse] = useState({
    error: '',
    success: ''
  });
  const [mealDetails, setMealDetails] = useState({
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    categoryId: '',
    metadata: {},
    menuId: ''
  });
  const [isLoading, setIsLoading] = useState({
    createMenuCategory: false,
    createMeal: false,
  });
  const selectedRestaurantMenuId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.menuId);
  const [createMenuCategory] = useCreateMenuCategoryMutation();
  const [createMeal] = useCreateMealMutation();
  const { data: categories } = useGetMenuCategoriesQuery(selectedRestaurantMenuId || '');
  const uploadImgInputRef = useRef<HTMLInputElement>(null);

  async function handleCreateMenuCategory(e: React.FormEvent) {
    e.preventDefault();

    setMenuCategoryResponseMessage({
      success: '',
      error: ''
    });

    if (menuName.length === 0) {
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

    setIsLoading({
      ...isLoading,
      createMenuCategory: true,
    });

    const result = await createMenuCategory({
      name: menuName,
      menuId: selectedRestaurantMenuId,
    }).unwrap();

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

    setIsLoading({
      ...isLoading,
      createMenuCategory: false,
    });
    setMenuName('');
  }

  function handleMealDetilChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { dataset, value } = e.target;
    const field = dataset.menuDetailField as keyof Omit<CreateMealRequest, 'metadata'>;
    if (field === 'price') {
      setMealDetails({
        ...mealDetails,
        price: parseFloat(value),
      })
    } else {
      setMealDetails({
        ...mealDetails,
        [field]: value,
      });
    }
  }

  async function handleCreateMeal(e: React.FormEvent) {
    e.preventDefault();

    setMealResponse({
      success: '',
      error: ''
    });

    const formData = new FormData();
    formData.append('name', mealDetails.name);
    formData.append('price', mealDetails.price.toString());
    formData.append('description', mealDetails.description);
    formData.append('imageUrl', '');
    formData.append('categoryId', mealDetails.categoryId);
    formData.append('menuId', selectedRestaurantMenuId || '');
    formData.append('imageFile', uploadImgInputRef.current?.files?.[0] || '');

    if (
      !mealDetails.name ||
      !mealDetails.description ||
      mealDetails.categoryId === "-1" ||
      !mealDetails.price ||
      !uploadImgInputRef.current?.files?.[0]
    ) {
      setMealResponse({
        ...mealResponse,
        error: 'Asegurate de que todas las propiedades esten definidas'
      });
      return;
    }

    setIsLoading({
      ...isLoading,
      createMeal: true,
    });

    const response = await createMeal(formData).unwrap();

    if (response.error || !response.success) {
      if (response.statusCode === 400) {
        setMealResponse({
          ...mealResponse,
          error: 'Todos los campos son requeridos y la imagen debe ser de tipo: jpeg, png o webp',
        });
      }
      setMealResponse({
        ...mealResponse,
        error: response.message,
        success: ''
      });
    }

    if (response.success) {
      setMealResponse({
        ...mealResponse,
        success: response.message,
        error: ''
      });
    }

    setIsLoading({
      ...isLoading,
      createMeal: false,
    });

    setMealDetails({
      name: '',
      price: 0,
      description: '',
      imageUrl: '',
      categoryId: '',
      metadata: {},
      menuId: ''
    });
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
                <Input id="category-name" value={menuName} placeholder="e.g., Main Course" onChange={(e) => setMenuName(e.target.value)} />
              </div>
              <Button type="submit">Agregar Categoría</Button>
              {isLoading.createMenuCategory && <Loader />}
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
            <form className="space-y-4" onSubmit={(e) => handleCreateMeal(e)}>
              <div className="space-y-2">
                <Label htmlFor="dish-name">Nombre</Label>
                <Input id="dish-name" value={mealDetails.name} placeholder="e.g., Classic Burger" data-menu-detail-field="name" onChange={handleMealDetilChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={mealDetails.categoryId} onValueChange={(value) => setMealDetails({ ...mealDetails, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      categories && categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))
                    }
                    {
                      !categories && <SelectItem value="-1">No hay categorías, asegurate de que hayas seleccionado un restaurante</SelectItem>
                    }
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="dish-name">URL imagen</Label>
                <Input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  id="dish-name"
                  placeholder="URL imagen"
                  data-menu-detail-field="imageUrl" onChange={handleMealDetilChange}
                  ref={uploadImgInputRef} />
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
              <Button type="submit">Agregar platillo</Button>

              {isLoading.createMeal && <Loader />}
              {
                mealResponse.error && <p className="text-red-500">{mealResponse.error}</p>
              }
              {
                mealResponse.success && <p className="text-green-500">{mealResponse.success}</p>
              }
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
