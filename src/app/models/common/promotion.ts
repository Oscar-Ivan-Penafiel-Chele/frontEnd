export interface Promotion {
    id_promotion?:number;
    id_user:number;
    id_product: number;
    producto : any;
    promotion_discount?:number;
    promotion_date_start : string;
    promotion_date_of_expiry : string;
    promotion_status:number;
    promotion_description : string;
    create_date? : string;
    update_at? : string;
}