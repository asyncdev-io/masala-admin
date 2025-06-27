import { Menu } from "./menu";
import { RestaurantCategory } from "./restaurant.category";

export interface RestaurantRequest {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  labelIds: string[];
}

export interface RestaurantReAuthOnboardingRequest {
  restaurantId: string;
}

export interface CreateRestaurantRequest {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  labelIds: string[];
  email: string;
}

export interface CreateRestaurantResponse {
  message: string;
  restaurant: Restaurant;
  stripeOnboardingUrl: string;
  restaurantId: string;
  warnings: string[];
}

export interface Restaurant extends RestaurantRequest {
  id: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  menu: Menu;
  onboardingComplete: boolean;
  category: RestaurantCategory; // Nuevo campo para la relación
  labelIds: string[]; // Añadir para exponer las etiquetas seleccionadas
}

export interface RestaurantOnboardingCompleteResponse {
  message: "Onboarding complete",
  success: true
}
