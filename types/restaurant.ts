import { Menu } from "./menu";

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
}

export interface Restaurant extends RestaurantRequest {
  id: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  menu: Menu;
  onboardingComplete: boolean;
}

export interface RestaurantOnboardingCompleteResponse {
  message: "Onboarding complete",
  success: true
}
