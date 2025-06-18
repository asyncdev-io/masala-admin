import { Category } from "./category";

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  imageFile?: File | null;
  imageUrl: string;
  category: Category;
}

export interface MealFormState extends Meal  {
  metadata: {};
  menuId: string;
}

export interface CreateMealRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  menuId: string;
  categoryId: string;
  metadata: { [key: string]: string };
}

export interface CreateMealResponse {
  error: string;
  message: string;
  statusCode: number;
  success: boolean;
  meal: Meal;
}