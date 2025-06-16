import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "@/types/order";
import { CreateRestaurantRequest, CreateRestaurantResponse, Restaurant, RestaurantOnboardingCompleteResponse, RestaurantReAuthOnboardingRequest, RestaurantRequest } from "@/types/restaurant";
import Cookie from "js-cookie"
import { Category } from "@/types/category";
import { MenuImportRequest, MenuImportResponse } from "@/types/menu";
import { CreateMealRequest, CreateMealResponse } from "@/types/meal";
import { RestaurantCategory } from "@/types/restaurant.category";
import { Label } from "@/types/label";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
  token: string;
}

interface MenuCategoryRequest {
  menuId: string;
  name: string;
}

interface MenuCategoryResponse {
  success: boolean;
  message: string;
  category: Category;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_MASALA_API_URL,
    prepareHeaders: (headers) => {
      const token = Cookie.get("masala-admin-token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers;
    }
  }),
  tagTypes: ["Orders", "Auth", "Restaurants", "MenuCategories"],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login-admin",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Orders endpoints
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: string; status: Order["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Orders", id },
        "Orders",
      ],
    }),

    updateRestaurant: builder.mutation<
      Restaurant,
      { adminId: string; id: string; data: Partial<RestaurantRequest> }
    >({
      query: ({ adminId, id, data }) => ({
        url: `/restaurants/${adminId}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Restaurants", id },
        "Restaurants",
      ],
    }),

    getMyRestaurants: builder.query<Restaurant[], void>({
      query: () => "/restaurants/admin/restaurants",
      providesTags: ["Restaurants"]
    }),

    createRestaurant: builder.mutation<CreateRestaurantResponse, FormData>({
      query: (data) => ({
        url: `/restaurants`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Restaurants"]
    }),

    completeRestaurantOnboarding: builder.mutation<RestaurantOnboardingCompleteResponse, string>({
      query: (restaurantId) => ({
        url: `/restaurants/onboarding/complete-onboarding/${restaurantId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Restaurants"]
    }),

    reauthOnboarding: builder.query<Pick<CreateRestaurantResponse, 'stripeOnboardingUrl'>, RestaurantReAuthOnboardingRequest>({
      query: ({restaurantId}) => ({
        url: `/restaurants/onboarding/re-auth/${restaurantId}`,
        method: "GET"
      }),
    }),

    // Menu categories endpoint
    createMenuCategory: builder.mutation<MenuCategoryResponse, MenuCategoryRequest>({
      query: (data) => ({
        url: "/menu-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MenuCategories"]
    }),

    getMenuCategories: builder.query<Category[], string>({
      query: (menuId) => `/menu-categories/${menuId}`,
      providesTags: ["MenuCategories"]
    }),

    // Menu items endpoint
    importMenu: builder.mutation<MenuImportResponse, MenuImportRequest>({
      query: (data) => ({
        url: "/menus/restaurant/import",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["MenuCategories"]
    }),

    // Meals endpoints
    createMeal: builder.mutation<CreateMealResponse, FormData>({
      query: (data) => ({
        url: "/meals",
        method: "POST",
        body: data
      })
    }),

    // Restaurants categories endpoint
    getRestaurantCategories: builder.query<RestaurantCategory[], void>({
      query: () => `/categories`
    }),

    // Labels endpoints
    getLabels: builder.query<Label[], void>({
      query: () => `/labels`
    })
  }),
});

export const {
  useLoginMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useGetMyRestaurantsQuery,
  useCreateRestaurantMutation,
  useCompleteRestaurantOnboardingMutation,
  useReauthOnboardingQuery,
  useCreateMenuCategoryMutation,
  useGetMenuCategoriesQuery,
  useImportMenuMutation,
  useCreateMealMutation,
  useGetRestaurantCategoriesQuery,
  useGetLabelsQuery
} = api;
