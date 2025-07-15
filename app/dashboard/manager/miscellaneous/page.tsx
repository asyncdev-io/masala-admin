"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteCommissionsRatesMutation, useGetCommissionRateQuery, useUpdateCommissionRateMutation } from '@/lib/store/api'
import React, { useRef, useState } from 'react'

export default function Miscellaneous() {
  const { data: miscellaneousCommission, error } = useGetCommissionRateQuery();
  const [deleteCommissionsRates] = useDeleteCommissionsRatesMutation();
  const [updateCommissionRate, { isLoading: isUpdating, isSuccess, isError }] = useUpdateCommissionRateMutation();
  const updateCommissionRateRef = useRef<number>(miscellaneousCommission && miscellaneousCommission.comissionRate * 100 || 0);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showWarningModalToDeleteCommmisions, setShowWarningModalToDeleteCommmisions] = useState<boolean>(false);
  const [selectedCommissionIdToPreserve, setSelectedCommissionIdToPreserve] = useState<string>('');
  const [showErrorTryingToDeleteCommisions, setShowErrorTryingToDeleteCommisions] = useState(false);

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
        setShowWarningModal(false);
      }
    } catch (error) {
      console.error('Error al actualizar la comisión:', error);
    }
  }

  async function deleteCommissions() {
    await deleteCommissionsRates(selectedCommissionIdToPreserve);
    setShowErrorTryingToDeleteCommisions(false);
  }

  return (
    <div>
      {
        // In case there are multiple commissions, user must select one
        error && (error as { status: number, data: any }).status === 409 ? (
          <div>
            <h2 className='text-red-500'>Multiples comisiones</h2>
            <p>Seleccione la comision con la que se va a quedar, las otras serán eliminadas</p>
            <Button onClick={() => {
              if(!selectedCommissionIdToPreserve) {
                setShowErrorTryingToDeleteCommisions(true);
                return;
              }
              setShowWarningModalToDeleteCommmisions(true)
            }}>
              Eliminar comisiones
            </Button>
            {showErrorTryingToDeleteCommisions && <p className='text-red-500'>Seleccione la comision con la que se quedará</p>}
            <div className='mt-8'>
              {(error as { status: number, data: any }).data.data.map((commission: any) => (
                <div key={commission.id}>
                  <h2>
                    <input
                      type="checkbox"
                      checked={selectedCommissionIdToPreserve === commission.id}
                      onChange={() => { setSelectedCommissionIdToPreserve(commission.id) }} />
                    Comisión: {(commission.comissionRate * 100).toFixed(2)}%
                  </h2>
                </div>
              ))}
            </div>

            <Dialog open={showWarningModalToDeleteCommmisions} onOpenChange={setShowWarningModalToDeleteCommmisions}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Eliminacion de comisiones</DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de eliminar las comisiones?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowWarningModalToDeleteCommmisions(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={deleteCommissions}>
                    Sí
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )
          :
          (
            // In case there is no commission defined or there is one commission, user can create or update it
            <>
              <div>
                {
                  !miscellaneousCommission && (
                    <h2>Cree una comision</h2>
                  )
                }
                {
                  miscellaneousCommission && (
                    <>
                      <h2>Comisión actual: {(miscellaneousCommission.comissionRate * 100).toFixed(2)}%</h2>
                      <h2 className='text-center'>Cambie la comisión</h2>
                    </>
                  )
                }
                <form className='w-2/4 mx-auto' onSubmit={handleUpdateCommissionRate}>
                  <Label htmlFor="comissionRate">Nueva comisión</Label>
                  <Input
                    type="number"
                    id="comissionRate"
                    min="0"
                    max="100"
                    step="any"
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
            </>
          )
      }
    </div>
  )
}