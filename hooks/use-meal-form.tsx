import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useCreateMealMutation, useUpdateMealMutation } from "@/lib/store/api";
import { imageCompressor } from "@/lib/utils/image-compressor";

// Definir un tipo para el estado local del formulario de platillos
interface MealFormState {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: string;
  metadata: {};
  menuId: string;
  imageFile?: File | null; // Para el archivo de imagen a subir
}

interface UseMealFormProps {
  mealId?: string; // Si se proporciona, estamos en modo edición
  initialData?: MealFormState; // Datos iniciales del platillo para edición
}

export const useMealForm = ({ mealId, initialData }: UseMealFormProps) => {
  const isEditMode = !!mealId;

  const [mealDetails, setMealDetails] = useState<MealFormState>(initialData || {
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    categoryId: '',
    metadata: {},
    menuId: '',
    imageFile: null,
  });

  const [mealResponse, setMealResponse] = useState({
    error: '',
    success: ''
  });

  const [isLoading, setIsLoading] = useState({
    createMeal: false,
    updateMeal: false,
  });

  const selectedRestaurantMenuId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.menuId);
  const selectedRestaurantId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.id);

  const [createMeal] = useCreateMealMutation();
  const [updateMeal] = useUpdateMealMutation();

  const uploadImgInputRef = useRef<HTMLInputElement>(null);

  // Efecto para cargar datos iniciales en modo edición
  useEffect(() => {
    if (isEditMode && initialData) {
      setMealDetails(initialData);
    }
  }, [isEditMode, initialData]);


  function handleMealDetilChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { dataset, value, name, type } = e.target;
    const field = dataset.menuDetailField || name as keyof MealFormState;

    setMealDetails(prev => {
      if (field === 'price' && type === 'number') {
        return { ...prev, price: parseFloat(value) || 0 };
      }
      return { ...prev, [field]: value };
    });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMealDetails(prev => ({ ...prev, imageFile: e.target.files![0] }));
    } else {
      setMealDetails(prev => ({ ...prev, imageFile: null }));
    }
  };

  const validateMealDetails = () => {
    if (
      !mealDetails.name ||
      !mealDetails.description ||
      !mealDetails.price || mealDetails.price <= 0 ||
      mealDetails.categoryId === '-1' || mealDetails.categoryId === '-2' || !mealDetails.categoryId
    ) {
      setMealResponse({ success: '', error: 'Asegúrate de que el nombre, la descripción, el precio y la categoría estén definidos.' });
      return false;
    }

    if (!isEditMode && !uploadImgInputRef.current?.files?.[0]) {
      setMealResponse({ success: '', error: 'Se requiere una imagen para crear un platillo.' });
      return false;
    }
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMealResponse({ success: '', error: '' });

    if (!validateMealDetails()) {
      return;
    }

    setIsLoading({ ...isLoading, [isEditMode ? 'updateMeal' : 'createMeal']: true });

    const formData = new FormData();
    formData.append('name', mealDetails.name);
    formData.append('price', mealDetails.price.toString());
    formData.append('description', mealDetails.description);
    formData.append('categoryId', mealDetails.categoryId);
    formData.append('menuId', selectedRestaurantMenuId || '');
    formData.append('restaurantId', selectedRestaurantId || '');
    formData.append('imageUrl', mealDetails.imageUrl);

    // Compresion de la imagen
    if (uploadImgInputRef.current?.files?.[0]) {
      const imageFile = uploadImgInputRef.current.files[0];
      const compressedImage = await imageCompressor(imageFile, {
        maxWidth: 800,
        maxHeight: 600
      });
      formData.append('imageFile', compressedImage);
    }


    try {
      let response;
      if (isEditMode) {
        response = await updateMeal({ id: mealId!, data: formData }).unwrap();
      } else {
        response = await createMeal(formData).unwrap();
      }

      if (response.success) {
        setMealResponse({ success: response.message, error: '' });
        // Resetear solo si es creación
        if (!isEditMode) {
          setMealDetails({
            name: '', price: 0, description: '', imageUrl: '', categoryId: '', metadata: {}, menuId: '', imageFile: null
          });
          if (uploadImgInputRef.current) uploadImgInputRef.current.value = ''; // Limpiar input de archivo
        }
      } else {
        setMealResponse({ success: '', error: response.message });
      }
    } catch (error: any) {
      console.error("Error submitting meal:", error);
      setMealResponse({ success: '', error: error.data?.message || 'Error al procesar el platillo.' });
    } finally {
      setIsLoading({ ...isLoading, [isEditMode ? 'updateMeal' : 'createMeal']: false });
    }
  }

  return {
    mealDetails,
    setMealDetails,
    handleMealDetilChange,
    handleFileChange,
    handleSubmit,
    mealResponse,
    isLoading,
    uploadImgInputRef,
    isEditMode,
    selectedRestaurantMenuId,
    selectedRestaurantId,
  };
}