export interface IProvider {
    id_provider?:number;
    id_type_provider? : number; //check
    id_identification_type?:number;
    id_user?:number;
    provider_name?:string;//check
    provider_qualified? : number;//check
    provider_identification? : string;
    provider_address?:string;
    provider_email?:string;
    provider_products_offered?:string;
    provider_phone?:string;
    provider_landline?:string;
    provider_web_page?:string;
    provider_person_name?:string;
    provider_person_lastName?:string;
    provider_response_time_day?:number;
    provider_response_time_hour?:number;
    provider_status?:number;
}
