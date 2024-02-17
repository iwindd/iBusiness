"use client";
import React from 'react'
import { PaymentAction } from '../../action';
import { DialogActions, DialogTitle, Button, DialogContent, TextField, InputAdornment, ButtonGroup } from '@mui/material';
import { Session } from 'next-auth';
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider';

const Payment = (props: DialogProps<{
  session: Session,
  clear: () => void
}>) => {
  const cart = (props.data.session?.user.cart || []).filter(p => p.retail == props.data.session?.user.retail);
  const [Input, setInput] = React.useState<number>();
  const [type, setType] = React.useState<0 | 1>(0);
  const [note, setNote] = React.useState<string>("");
  const ref: any = React.useRef();
  const { setBackdrop } = useInterface();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBackdrop(true);
    props.onClose();
    const resp = await PaymentAction({ type, note });
    setBackdrop(false);
    if (!resp?.success) props.onOpen();

    props.data.clear()
  }

  return (
    <form onSubmit={onSubmit} >
      <DialogTitle>
        ชำระเงิน
      </DialogTitle>
      <DialogContent className=' space-y-2'>
        <label className="flex">
          <span >ราคารวม :</span>
          <span className="ms-auto">{cart.reduce((total, item) => total + item.price * item.count, 0).toLocaleString()} ฿</span>
        </label>
        <TextField
          autoFocus
          fullWidth
          label="คำนวณเงินทอน"
          ref={ref}
          type='number'
          value={Input}
          onChange={e => setInput(Number(e.target.value))}
          InputProps={{
            startAdornment: <InputAdornment position="start">฿</InputAdornment>,
            endAdornment: <InputAdornment position="end">{(((Input || 0)) - cart.reduce((total, item) => total + item.price * item.count, 0)).toLocaleString()}  ฿</InputAdornment>,
          }}
        />
        <TextField
          label="หมายเหตุ"
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          fullWidth
        />
        <ButtonGroup fullWidth>
          <Button variant={type == 0 ? "contained" : "outlined"} color='success' onClick={() => setType(0)}>เงินสด</Button>
          <Button variant={type == 1 ? "contained" : "outlined"} color='success' onClick={() => setType(1)}>ธนาคาร</Button>
        </ButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={props.onClose}>ยกเลิก</Button>
        <Button type="submit" >ตกลง</Button>
      </DialogActions>
    </form>

  )

  /*   const { data: session, update} = useSession();
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [Input, setInput] = React.useState<number>();
    const cart = (session?.user.cart || []).filter(p => p.retail == session?.user.retail)
  
    React.useEffect(() => {
      setInput(0);
    }, [isOpen])
  
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
  
    ) */
}

export default Payment