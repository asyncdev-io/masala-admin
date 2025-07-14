"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCommissionRateQuery, useUpdateCommissionRateMutation } from '@/lib/store/api'
import React, { useRef, useState } from 'react'

export default function Miscellaneous() {
  const { data: miscellaneousCommission } = useGetCommissionRateQuery();
  const [updateCommissionRate, { isLoading: isUpdating, isSuccess, isError }] = useUpdateCommissionRateMutation();
  const updateCommissionRateRef = useRef<number>(miscellaneousCommission && miscellaneousCommission.comissionRate * 100 || 0);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);

  async function handleUpdateCommissionRate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (updateCommissionRateRef.current === 0) {
      setShowWarningModal(true);
      return;
    }
    await submitCommissionRate();
  }

  async function submitCommissionRate() {
    const newCommissionRate = updateCommissionRateRef.current / 100;
    try {
      const response = await updateCommissionRate({
        newComissionRate: newCommissionRate,
      }).unwrap();

      if (response) {
        console.log('Comisión actualizada');
        setShowWarningModal(false);
      }
    } catch (error) {
      console.error('Error al actualizar la comisión:', error);
    }
  }

  async function handleCreateCommissionRate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (updateCommissionRateRef.current === 0) {
      setShowWarningModal(true);
      return;
    }
    await submitCommissionRate();
  }

  return (
    <div>
      {miscellaneousCommission ? (
        <div>
          <h2>Comisión actual: {miscellaneousCommission.comissionRate * 100}%</h2>
          <h2 className='text-center'>Cambie la comisión</h2>
          <form className='w-2/4 mx-auto' onSubmit={handleUpdateCommissionRate}>
            <Label htmlFor="comissionRate">Nueva comisión</Label>
            <Input
              type="number"
              id="comissionRate"
              min="0"
              max="100"
              step="1"
              onChange={(e) => updateCommissionRateRef.current = parseFloat(e.target.value)}
            />
            <Button className='mx-auto my-2' type="submit" disabled={isUpdating}>
              {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </Button>
            {
              isSuccess && (
                <p className='text-green-500 mt-2'>Comisión actualizada</p>
              )
            }
            {
              isError && (
                <p className='text-red-500 mt-2'>Error al actualizar la comisión</p>
              )
            }
          </form>
        </div>
      ) : (
        <div>
          <h2 className='text-center'>Crear comisión inicial</h2>
          <form className='w-2/4 mx-auto' onSubmit={handleCreateCommissionRate}>
            <Label htmlFor="initialComissionRate">Comisión inicial</Label>
            <Input
              type="number"
              id="initialComissionRate"
              min="0"
              max="100"
              step="1"
              onChange={(e) => updateCommissionRateRef.current = parseFloat(e.target.value)}
            />
            <Button className='mx-auto my-2' type="submit" disabled={isUpdating}>
              {isUpdating ? 'Creando...' : 'Crear'}
            </Button>
            {
              isSuccess && (
                <p className='text-green-500 mt-2'>Comisión Creada</p>
              )
            }
            {
              isError && (
                <p className='text-red-500 mt-2'>Error al crear la comisión</p>
              )
            }
          </form>
        </div>
      )}

      <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar comisión 0%</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de poner la comisión en 0%?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarningModal(false)}>
              Cancelar
            </Button>
            <Button onClick={submitCommissionRate}>
              Sí
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}