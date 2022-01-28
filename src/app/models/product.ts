export interface Product {
    id_product?:number;
    id_user?:number;
    id_provider?:number;
    id_brand?:number;
    id_product_category : number[];
    code?:string;
    name?:string;
    description?:string;
    quantity?:number;
    price?:number;
    status?:string;
    image?:string;
    rating?:number;
    createDate : Date;
    updateDate : Date;
}