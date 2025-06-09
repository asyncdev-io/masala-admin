"use client";

import { useCompleteRestaurantOnboardingMutation } from '@/lib/store/api';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast';
import Loader from '@/components/ui/loader';

export default function OnboardingSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const restaurantId = searchParams.get('restaurantId');
  const [completeRestaurantOnboarding] = useCompleteRestaurantOnboardingMutation();

  useEffect(() => {
    (async () => {
      if (!restaurantId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se ha proporcionado un ID de restaurante"
        });
        router.push('/dashboard');
        return;
      }

      try {
        const response = await completeRestaurantOnboarding(restaurantId);
        console.log(response);
        if (response.data) {
          if (response.data.success) {
            toast({
              title: "¡Éxito!",
              description: response.data.message
            });
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: response.data.message
            });
          }
        } else if ('error' in response) {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.error as string
          });
        }
        router.push('/dashboard');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al procesar la solicitud"
        });
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [restaurantId, completeRestaurantOnboarding, toast, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <Loader size="lg" />
      ) : null}
    </div>
  )
}