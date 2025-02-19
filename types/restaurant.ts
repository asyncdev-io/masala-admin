export interface RestaurantRequest {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  labelIds: string[];
}

export interface Restaurant extends RestaurantRequest {
  id: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
}
