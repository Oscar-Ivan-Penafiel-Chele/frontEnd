export interface Product {
    id_product?:number;
    id_user?:number;
    id_provider?:number;
    id_brand?:number;
    brand : any;
    category : any;
    provider : any;
    product_unit : any;
    id_category?:any;
    id_product_unit?:number;
    product_code?:number;
    product_name?:string;
    product_description?:string;
    product_stock?:number;
    product_price?:number;
    product_image?:string;
    product_status:number;
    product_rating?:number;
    create_date? : string;
    update_at? : string;
}
