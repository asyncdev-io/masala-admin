import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "@/types/order";
import { CreateRestaurantResponse, Restaurant, RestaurantOnboardingCompleteResponse, RestaurantReAuthOnboardingRequest, RestaurantRequest } from "@/types/restaurant";
import Cookie from "js-cookie"
import { Category } from "@/types/category";
import { MenuImportRequest, MenuImportResponse } from "@/types/menu";
import { CreateMealResponse, Meal } from "@/types/meal";
import { RestaurantCategory } from "@/types/restaurant.category";
import { Label } from "@/types/label";
import { NotificationAPI } from "@/types/notification";
import { CategoryMeals } from "@/types/category.meals";
import { IPendingPayments } from "@/types/payments";

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
  tagTypes: ["Orders", "Auth", "Restaurants", "MenuCategories", "Meals", "PendingPayments"],
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

    // Get pending payments for restaurant
    getPendingPayments: builder.query<IPendingPayments[], {startDate: string, endDate: string, restaurantId?: string}>({
      query: ({ startDate, endDate, restaurantId }) => ({
        url: `/manager/payments/pending?startDate=${startDate}&endDate=${endDate}&restaurantId=${restaurantId}`,
        method: "GET",
      }),
      providesTags: ["PendingPayments"]
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
      }),
      invalidatesTags: ["Meals"]
    }),

    updateMeal: builder.mutation<CreateMealResponse, { id: string; data: FormData; }>({
      query: ({id, data}) => ({
        url: `/meals/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Meals"]
    }),

    getMealById: builder.query<Meal, string>({
      query: (id) => `/meals/${id}`,
      providesTags: ["Meals"]
    }),

    getMealsByRestaurant: builder.query<CategoryMeals[], string>({
      query: (restaurantId) => ({
        url: `/meals/restaurant/${restaurantId}`
      }),
      providesTags: ["Meals"]
    }),

    // Restaurants categories endpoint
    getRestaurantCategories: builder.query<RestaurantCategory[], void>({
      query: () => `/categories`
    }),

    // Labels endpoints
    getLabels: builder.query<Label[], void>({
      query: () => `/labels`
    }),
    //Notification endpoints
    getNotificationsByRestaurant: builder.query<NotificationAPI[], string>({
    query: (restaurantId) => `/restaurants/notifications/${restaurantId}`,
    }),
    // Confirm and Cancel the order
  confirmOrder: builder.mutation<any, string>({
  query: (notificationId) => ({
    url: `/restaurants/notifications/${notificationId}/confirm`,
    method: "POST",
  }),
  invalidatesTags: ["Orders", "Auth"],
}),
cancelOrder: builder.mutation<any, string>({
  query: (notificationId) => ({
    url: `/restaurants/notifications/${notificationId}/cancel`,
    method: "POST",
  }),
  invalidatesTags: ["Orders", "Auth"],
  }),

  }),
});

export const {
  // Auth endpoints
  useLoginMutation,
  // Orders endpoints
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  // Restaurants endpoints
  useGetMyRestaurantsQuery,
  useCreateRestaurantMutation,
  useCompleteRestaurantOnboardingMutation,
  useReauthOnboardingQuery,
  useGetPendingPaymentsQuery,
  // Menu categories endpoint
  useCreateMenuCategoryMutation,
  useGetMenuCategoriesQuery,
  // Menu endpoint
  useImportMenuMutation,
  // Meals endpoints
  useCreateMealMutation,
  useUpdateMealMutation,
  useGetMealByIdQuery,
  useGetMealsByRestaurantQuery,
  // Restaurants categories endpoint
  useGetRestaurantCategoriesQuery,
  // Labels endpoints
  useGetLabelsQuery,
  // Notification endpoints
  useGetNotificationsByRestaurantQuery,
  // Confirm and Cancel the order
  useConfirmOrderMutation,
  useCancelOrderMutation,
  useUpdateRestaurantMutation,
} = api;
