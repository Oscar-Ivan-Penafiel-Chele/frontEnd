import { Product } from "./product";

export interface Order{
    id_order : number,
    products : Product[],
    price_order_total : number,
}