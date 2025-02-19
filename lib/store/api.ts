import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "@/types/order";
import { Restaurant, RestaurantRequest } from "@/types/restaurant";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
  token: string;
}

interface LogoutResponse {
  success: boolean;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_MASALA_API_URL,
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
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
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
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} = api;
