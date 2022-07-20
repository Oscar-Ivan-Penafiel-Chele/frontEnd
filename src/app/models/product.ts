import { Measure } from "./measure";

export interface Product {
    id_product?:number;
    id_user?:number;
    id_provider?:number;
    id_brand?:number;
    id_category?:any;
    id_product_unit?:number;
    brand : any;
    category : any;
    provider : any;
    product_unit : Measure;
    product_code?:number;
    product_name?:string;
    product_description?:string;
    product_stock?:number;
    product_IVA : number;
    product_IVA_porcent : number ;
    product_amount_sail? : number;
    product_price?:number;
    product_price_aux?:number;
    product_offered? : number ;
    product__price__iva : any;
    productWithDiscount : any;
    product_price_amount : any;
    product_offered_price_total? : number;
    product_price_total?: any;
    product_image?:string;
    product_status:number;
    product_rating?:number;
    create_date? : string;
    update_at? : string;
}
