"use client";
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface Props {
  params: {
    serial: string
  }
}

import { Schema, Inputs } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { addProduct, deleteProduct } from '../action';

function Product({ params }: Props) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(Schema),
    defaultValues: {
      serial: params.serial,
      price: 0,
      cost: 0,
      stock: 0
    }
  });

  const onSubmit: SubmitHandler<Inputs> = async (payload) => {
    const resp = await addProduct(payload);

    if (!resp.success) return;
    router.push("/products");
  }

  const onDelete = async () => {
    const resp = await deleteProduct(params.serial);

    if (!resp.success) return;
    router.push("/products");
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-1 w-96'>
        <input className='input input-bordered' placeholder='รหัสสินค้า' {...register("serial")} disabled={true} />
        <p className="text-error">{errors.serial?.message}</p>
        <input className='input input-bordered' placeholder='ชื่อสินค้า' {...register("title")} autoFocus />
        <p className="text-error">{errors.title?.message}</p>
        <input className='input input-bordered' type='number' placeholder='ราคาขาย' {...register("price", { valueAsNumber: true })} />
        <p className="text-error">{errors.price?.message}</p>
        <input className='input input-bordered' type='number' placeholder='ราคาต้นทุน' {...register("cost", { valueAsNumber: true })} />
        <p className="text-error">{errors.cost?.message}</p>
        <input className='input input-bordered' type='number' placeholder='สต๊อก' {...register("stock", { valueAsNumber: true })} />
        <p className="text-error">{errors.stock?.message}</p>

        <button className="btn btn-primary">บันทึกสินค้า</button>
        <button className="btn btn-error" onClick={onDelete} type='button'>ลบสินค้า</button>
      </form>
    </div>
  )
}

export default Product