"use client";
import React from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { Schema, Inputs } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmButton from '@/app/components/confirm_button';
import { addDesign, deleteDesign, saveDesign } from '../action';

export interface Design {
  title: string,
  subtitle: string,
  paragraph: string,
  rows: number,
  fields: {
    row: number,
    title: string
  }[]
}

interface Props {
  target: string,
  state: boolean,
  setState: React.Dispatch<React.SetStateAction<boolean>>,
  values?: Inputs,
  design: Design,
  setDesign: React.Dispatch<React.SetStateAction<string>>
}

function DesignDialog({
  target,
  state: isOpen,
  setState: setIsOpen,
  values,
  design: payload,
  setDesign
}: Props) {
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Inputs>({
    resolver: zodResolver(Schema),
    defaultValues: {
      title: ""
    }
  });

  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<Inputs> = async (title) => {
    setLoading(true);
    let newId: string = target;
    if (target == "-1") {
      const resp = await addDesign({ ...title, design: payload });
      if (!resp.success) return setLoading(false);
      newId = String(resp?.data?.id as number);
    } else {
      const resp = await saveDesign({ ...title, design: payload, target: Number(target) });
      if (!resp.success) return setLoading(false);
    }

    setLoading(false);
    setIsOpen(false);
    await queryClient.refetchQueries({ queryKey: ['OrderReceiptDesigns'], type: 'active' })
    setDesign(newId);
  }

  const onDelete = async () => {
    setLoading(true);
    const resp = await deleteDesign(Number(target) as number);
    if (!resp.success) return setLoading(false);

    setLoading(false);
    setIsOpen(false);
    setDesign("-1");
    await queryClient.refetchQueries({ queryKey: ['OrderReceiptDesigns'], type: 'active' })
  }

  React.useEffect(reset, [values])
  React.useEffect(() => {
    if (values?.title) setValue("title", values.title);
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
                      ชื่อ Design
                      <div className="divider"></div>
                    </Dialog.Title>
                    <p className="text-sm text-gray-500">
                      <div className='flex flex-col space-y-1 w-full'>
                        <input className='input input-bordered focus:text-white transition-all' placeholder='design name...' {...register("title")} autoFocus required />
                        <p className="text-error">{errors.title?.message}</p>
                      </div>
                    </p>

                    <div className="mt-4">
                      <div className='flex justify-between w-full'>
                        <section className='space-x-2'>
                          <button
                            type="submit"
                            className="btn btn-success"
                          >
                            บันทึก
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setIsOpen(false)}
                          >
                            ยกเลิก
                          </button>
                        </section>
                        <ConfirmButton
                          className="btn btn-error ms-auto"
                          label='ลบ'
                          label2='ลบ ?'
                          onClick={onDelete}
                        />
                      </div>
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

export default DesignDialog