import { Product } from "./product";

export interface IPurchaseOrder{
    id: number,
    id_provider: number,
    id_user: number,
    products: IPurchaseOrderProducts[],
    purchase_order_status: number,
    total: number,
    create_date: Date,
    updated_at: Date,
}

export interface IPurchaseOrderProducts{
    product: Product,
    amount: number,
}