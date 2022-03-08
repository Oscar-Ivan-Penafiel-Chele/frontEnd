import { Product } from "./product";

export interface Promotion {
    id_promotion?:number;
    promotion_product: number;
    promotion_discount?:number;
    promotion_date_of_expiry : string;
    promotion_status:number;
    create_date? : string;
    update_at? : string;
}