export interface Sail{
    id_inventory_e : number,
    id_order : number,
    user : any,
    order : any,
    inventory_movement_type : string,
    inventory_stock_amount : string,
    inventory_description : string,
    create_date : string,
    update_at : string,
}

export interface ISailResponse{
    name_sail : string,
    lastName_sail : string,
    description_sail : string,
    voucher_sail : string,
    date_creation : string,
    sail : Sail[]
}