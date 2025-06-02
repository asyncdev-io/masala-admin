export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  imageFile: File;
  imageUrl: string;
  category: string;
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