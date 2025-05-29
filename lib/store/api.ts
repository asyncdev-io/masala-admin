import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "@/types/order";
import { Restaurant, RestaurantRequest } from "@/types/restaurant";
import Cookie from "js-cookie"
import { Category } from "@/types/category";
import { MenuImportRequest, MenuImportResponse } from "@/types/menu";

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
  tagTypes: ["Orders", "Auth", "Restaurants"],
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

    // Restaurants endpoints
    createRestaurant: builder.mutation<
      Restaurant,
      { adminId: string; data: RestaurantRequest }
    >({
      query: ({ adminId, data }) => ({
        url: `/restaurants/${adminId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Restaurants"],
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

    // Menu categories endpoint
    createMenuCategory: builder.mutation<MenuCategoryResponse, MenuCategoryRequest>({
      query: (data) => ({
        url: "/menu-categories",
        method: "POST",
        body: data,
      })
    }),

    // Menu items endpoint
    importMenu: builder.mutation<MenuImportResponse, MenuImportRequest>({
      query: (data) => ({
        url: "/menus/restaurant/import",
        method: "POST",
        body: data
      })
    })
  }),
});

export const {
  useLoginMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useGetMyRestaurantsQuery,
  useCreateMenuCategoryMutation,
  useImportMenuMutation
} = api;
