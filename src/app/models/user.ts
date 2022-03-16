export interface User {
      id_user?:number;
      id_user_created?:number;
      id_role?:number;
      id_identification_type?:number;
      user_name?:string;
      user_lastName?:string;
      email?:string;
      user_address?:string;
      user_address_reference? : string;
      user_document?:string;
      password?:string;
      user_phone?:string;
      user_status?:number;
      role_user?:any;
      create_date?: Date;
      updated_at?: Date;
}
