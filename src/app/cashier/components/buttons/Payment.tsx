"use client";
import React from 'react'
import { PaymentAction } from '../../action';
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Inputs, Schema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

const Payment = ({ isOpen, setIsOpen }: {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { data: session, update} = useSession();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [Input, setInput] = React.useState<number>();
  const cart = session?.user.cart || [];

  React.useEffect(() => {
    setInput(0);
  }, [isOpen])

  const { register, handleSubmit } = useForm<Inputs>({
    resolver: zodResolver(Schema),
    defaultValues: {
      note: "",
      method: "cash"
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    setLoading(true)
    const resp = await PaymentAction({
      type: payload.method == "cash" ? 0 : 1,
      note: payload.note
    });

    if (!resp?.success) return setLoading(false);

    update({
      ...session,
      user: {
        ...session?.user,
        cart: []
      }
    })
    setIsOpen(false);
    setLoading(false);
  }

  return (
    <>
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
                    <main>
                      <form action="" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                          <label className="label">
                            <span className="label-text">ราคารวม :</span>
                            <span className="label-text-alt">{cart.reduce((total, item) => total + item.price * item.count, 0).toLocaleString()} ฿</span>
                          </label>
                        </div>
                        <div>
                          <label className="label">
                            <span className="label-text">เงินทอน :</span>
                            <span className="label-text-alt">{((Input as number) - cart.reduce((total, item) => total + item.price * item.count, 0)).toLocaleString()} ฿</span>
                          </label>
                          <input type="text" placeholder='คำนวณเงินทอน' value={Input} onChange={(e) => setInput(Number(e.target.value) || 0)} className='input w-full' autoFocus />
                        </div>
                        <div>
                          <label className="label label-text">หมายเหตุ :  </label>
                          <textarea className="textarea textarea-ghost w-full mb-2 resize-none" placeholder="หมายเหตุ" {...register("note")}></textarea>
                        </div>
                        <div>
                          <label className="label label-text">ช่องทางการชำระ :  </label>
                          <div className="btn-group flex" {...register("method")}>
                            <input type="radio" value="cash" name="paymentMethod" data-title="เงินสด" className="btn transition-all checked:flex-grow" defaultChecked={true} />
                            <input type="radio" value="bank" name="paymentMethod" data-title="ธนาคาร" className="btn transition-all checked:flex-grow" defaultChecked={false} />
                          </div>
                        </div>
                        <div className="divider"></div>
                        <div className="flex gap-2">
                          <button type="submit" className="btn btn-success flex-grow">ทำรายการ</button>
                          <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>ยกเลิก</button>
                        </div>
                      </form>
                    </main>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          ) : (
            <div className='fixed inset-0 flex min-h-full items-center justify-center overflow-hidden'>
              <span className="loading loading-ring loading-lg"></span>
            </div>
          )}
        </Dialog>
      </Transition >
    </>

  )
}

export default Payment