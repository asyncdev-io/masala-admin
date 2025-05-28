import { useGetMyRestaurantsQuery, useImportMenuMutation } from '@/lib/store/api'
import { RootState } from '@/lib/store/store';
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { CircleX } from 'lucide-react';

export default function ModalImportMenu({ showModalMenuImport }: { showModalMenuImport: Function }) {

  const sourceMenuIdRef = useRef('');
  const { data: restaurants } = useGetMyRestaurantsQuery();
  const { menuId: targetMenuId, name } = useSelector((state: RootState) => state.restaurant.selectedRestaurant);
  const [ importMenu ] = useImportMenuMutation();
  const [ userFeedbackMessages, setUserFeedbackMessages ] = useState({
    error: '',
    success: ''
  });

  async function handleImportMenu() {
    if(!sourceMenuIdRef.current) {
      setUserFeedbackMessages({
        success: '',
        error: 'Selecciona un restaurante primero'
      });
      return;
    }

    if(!targetMenuId) {
      setUserFeedbackMessages({
        success: '',
        error: 'Selecciona un restaurante primero'
      });
      return;
    }

    const response = await importMenu({
      sourceMenuId: sourceMenuIdRef.current,
      targetMenuId: targetMenuId
    }).unwrap();

    if(response.success) {
      setUserFeedbackMessages({
        success: 'Menu importado correctamente',
        error: ''
      })
    } else {
      setUserFeedbackMessages({
        success: '',
        error: 'Hubo un error al importar el menu'
      })
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-[500px]">
          <div className="flex justify-between align-middle">
            <h2 className="text-2xl font-bold">Importa un menu</h2>
            <button onClick={() => showModalMenuImport(false)}>
              <CircleX className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Copia el contenido de otro menu para este restaurante <b>{name}</b>,
            conservaras cualquier categoria que tenga el resturante actual
          </p>

          <select
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => sourceMenuIdRef.current = e.target.value}
          >
            <option value="">Select a restaurant</option>
            {
              !restaurants && <option value="">No restaurants</option>
            }
            {
              restaurants && restaurants.map((restaurant) => {
                if (restaurant.name === name) return;
                return (
                  <option key={restaurant.id} value={restaurant.menu.id}>
                    {restaurant.name}
                  </option>
                )
              })
            }
          </select>

          <button
            onClick={handleImportMenu}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Importar Menu
          </button>

          {
            userFeedbackMessages.error && <p className="text-red-500 mt-2">{userFeedbackMessages.error}</p>
          }

          {
            userFeedbackMessages.success && <p className="text-green-500 mt-2">{userFeedbackMessages.success}</p>
          }
        </div>
      </div>
    </>
  )
}
