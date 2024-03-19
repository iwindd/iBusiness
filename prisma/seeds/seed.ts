import { PrismaClient } from '@prisma/client';
import orders from './orders.json';
import orders_products from './order_products.json';
import products from './products.json';

const prisma = new PrismaClient()

// Assuming ProductCreateManyInput has properties similar to this:
interface ProductCreateManyInput {
  application: number;
  favorite: boolean;
  categoryId: number;
  id: number;
  serial: string;
  title: string;
  price: string;
  cost: string;
  stock: string;
  retail: string;
  sold: string;
}

// Assuming products is an array of objects with similar structure
const products: Array<YourProductType> = [...];

// Assuming YourProductType has properties similar to this:
interface YourProductType {
  serial: string;
  title: string;
  price: string;
  cost: string;
  stock: string;
  retail: string;
  sold: string;
}

// Mapping products to match ProductCreateManyInput
const mappedProducts = products.map(p => {
  return {
    application: 1,
    favorite: false,
    categoryId: 1,
    id: 0,
    serial: p.serial,
    title: p.title,
    price: p.price,
    cost: p.cost,
    stock: p.stock,
    retail: false, // Or whatever value makes sense according to your schema
    sold: p.sold
  };
});

const load = async () => {
  try {

    // Calling prisma.product.createMany with mappedProducts
    prisma.product.createMany({
      data: mappedProducts
    });
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}


load()