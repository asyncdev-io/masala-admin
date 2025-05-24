"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Users } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetMyRestaurantsQuery } from "@/lib/store/api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedRestaurant } from "@/lib/store/restaurantSlice";
import { RootState } from "@/lib/store/store";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { data: restaurants } = useGetMyRestaurantsQuery();
  const selectedRestaurant = useSelector((state: RootState) => state.restaurant.selectedRestaurant);

  const handleRestaurantChange = (value: string) => {
    const selectedRestaurant = restaurants?.find(restaurant => restaurant.id === value);
    if (selectedRestaurant) {
      dispatch(setSelectedRestaurant({
        id: selectedRestaurant.id,
        name: selectedRestaurant.name
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Dropdown to select the restaurant */}
      <div className="max-w-xs">
        <Select value={selectedRestaurant.id || undefined} onValueChange={handleRestaurantChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un restaurante" />
          </SelectTrigger>
          <SelectContent>
            {
              !restaurants &&
              <SelectItem key={1} value={'-1'}>
                'No tienes restaurantes que administrar'
              </SelectItem>
            }
            {restaurants?.map((restaurant) => (
              <SelectItem key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Restaurant stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}