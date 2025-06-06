import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RestaurantState {
  selectedRestaurant: {
    id: string | null;
    name: string | null;
    menuId: string | null;
    hasCompleteOnboarding: boolean | null;
  };
}

const initialState: RestaurantState = {
  selectedRestaurant: {
    id: null,
    name: null,
    menuId: null,
    hasCompleteOnboarding: null,
  }
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setSelectedRestaurant: (state, action: PayloadAction<{ id: string | null; name: string | null, menuId: string | null, hasCompleteOnboarding: boolean | null }>) => {
      state.selectedRestaurant = action.payload;
    },
  },
});

export const { setSelectedRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;