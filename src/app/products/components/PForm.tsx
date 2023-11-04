"use client";
import React from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { Schema, Inputs } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { addProduct, deleteProduct, saveProduct } from '../action';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  serial: string,
  state: boolean,
  setState: React.Dispatch<React.SetStateAction<boolean>>,
  values?: Inputs,
  isNewItem: boolean
}

function PForm({
  serial,
  state: isOpen,
  setState: setIsOpen,
  values,
  isNewItem
}: Props) {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Inputs>({
    resolver: zodResolver(Schema),
    defaultValues: {
      serial: serial,
      price: 0,
      cost: 0,
      stock: 0
    }
  });

  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    setLoading(true);

    if (isNewItem) {
      const resp = await addProduct({ ...payload, serial: serial });
      if (!resp.success) return setLoading(false);
    } else {
      const resp = await saveProduct({ ...payload, serial: serial });
      if (!resp.success) return setLoading(false);
    }

    queryClient.refetchQueries({ queryKey: ['products'], type: 'active' })
    setIsOpen(false);
    setLoading(false);
  }

  const onDelete = async () => {
    setLoading(true);
    const resp = await deleteProduct(serial);
    if (!resp.success) return setLoading(false);

    queryClient.refetchQueries({ queryKey: ['products'], type: 'active' })
    setIsOpen(false);
    setLoading(false);
  }

  React.useEffect(reset, [values, isNewItem, serial])
  React.useEffect(() => {
    if (values?.serial) setValue("serial", values.serial);
    if (values?.title) setValue("title", values.title);
    if (values?.price) setValue("price", values.price);
    if (values?.cost) setValue("cost", values.cost);
    if (values?.stock) setValue("stock", values.stock);
  }, [values])


  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>
        {!isLoading ? (
          <form onSubmit={handleSubmit(onSubmit)} >
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 "
                    >
                      รหัสสินค้า :
                      <span className='ms-auto'> {serial || "?"}</span>
                      <div className="divider"></div>
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      <div className='flex flex-col space-y-1 w-full'>
                        <input className='input input-bordered focus:text-white transition-all' type='hidden' placeholder='รหัสสินค้า' {...register("serial")} disabled={true} />
                        <p className="text-error">{errors.serial?.message}</p>
                        <input className='input input-bordered focus:text-white transition-all' placeholder='ชื่อสินค้า' {...register("title")} autoFocus required />
                        <p className="text-error">{errors.title?.message}</p>
                        <input className='input input-bordered focus:text-white transition-all' type='number' placeholder='ราคาขาย' {...register("price", { valueAsNumber: true })} required />
                        <p className="text-error">{errors.price?.message}</p>
                        <input className='input input-bordered focus:text-white transition-all' type='number' placeholder='ราคาต้นทุน' {...register("cost", { valueAsNumber: true })} required />
                        <p className="text-error">{errors.cost?.message}</p>
                        <input className='input input-bordered focus:text-white transition-all' type='number' placeholder='สต๊อก' {...register("stock", { valueAsNumber: true })} required />
                        <p className="text-error">{errors.stock?.message}</p>
                      </div>
                    </p>

                    <div className="mt-4 flex justify-between">
                      <div className='flex gap-2'>
                        <button
                          type="submit"
                          className="btn btn-success"
                        >
                          บันทึกสินค้า
                        </button>
                        <div>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsOpen(false)}
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-error"
                        onClick={onDelete}
                        disabled={isNewItem}
                      >
                        ลบสินค้า
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </form>
        ) : (
          <div className='fixed inset-0 flex min-h-full items-center justify-center overflow-hidden'>
            <span className="loading loading-ring loading-lg"></span>
          </div>
        )}
      </Dialog>
    </Transition >
  )
}

export default PForm