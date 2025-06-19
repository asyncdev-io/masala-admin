import { useState } from "react";
import { useCreateMenuCategoryMutation } from "@/lib/store/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

export default function useMenuCategoryForm() {
  const [menuName, setMenuName] = useState('');
  const [menuCategoryResponseMessage, setMenuCategoryResponseMessage] = useState({
    error: '',
    success: ''
  });
  const [isLoading, setIsLoading] = useState({
    createMenuCategory: false,
  });

  const selectedRestaurantMenuId = useSelector((state: RootState) => state.restaurant.selectedRestaurant.menuId);
  const [createMenuCategory] = useCreateMenuCategoryMutation();

  async function handleCreateMenuCategory(e: React.FormEvent) {
    e.preventDefault();

    setMenuCategoryResponseMessage({
      success: '',
      error: ''
    });

    if (menuName.length === 0) {
      setMenuCategoryResponseMessage({ error: 'El nombre de la categoría es requerido', success: '' });
      return;
    }
    if (!selectedRestaurantMenuId) {
      setMenuCategoryResponseMessage({ error: 'Defina un restuarante para agregar esta categoría', success: '' });
      return;
    }

    setIsLoading({ createMenuCategory: true });

    try {
      const result = await createMenuCategory({
        name: menuName,
        menuId: selectedRestaurantMenuId,
      }).unwrap();

      if (!result.success) {
        setMenuCategoryResponseMessage({ success: '', error: result.message });
      } else {
        setMenuCategoryResponseMessage({ success: result.message, error: '' });
        setMenuName('');
      }
    } catch (error: any) {
      console.error("Error creating menu category:", error);
      setMenuCategoryResponseMessage({ success: '', error: error.data?.message || 'Error al crear la categoría.' });
    } finally {
      setIsLoading({ createMenuCategory: false });
    }
  }

  return {
    menuName,
    setMenuName,
    menuCategoryResponseMessage,
    isLoading,
    handleCreateMenuCategory,
    selectedRestaurantMenuId // Exponemos para que la vista pueda deshabilitar el input si es necesario
  };
}