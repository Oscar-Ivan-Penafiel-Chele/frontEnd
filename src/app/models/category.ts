export interface Category {
    id_category : number ;
    category_name : string ;
    category_descripcion : string;
    category_thumbnail : string;
    category_status?: number;
    producto_count : any;
    create_date : Date;
    upload_date : Date;
}
