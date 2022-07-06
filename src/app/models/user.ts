export interface User {
      id_user?:number;
      id_user_created?:number;
      id_role?:number;
      id_identification_type?:number;
      user_name?:string;
      user_lastName?:string;
      email?:string;
      user_address?: any;
      user_address_reference? : string;
      user_document?:string;
      password?:string;
      user_phone?:string;
      user_status?:number;
      role_user?:any;
      create_date?: Date;
      updated_at?: Date;
}


export interface Address{
      id_address : number,
      id_user : number,
      user_address : string,
      address_status : number,
      create_date : Date,
      updated_at : Date,
}