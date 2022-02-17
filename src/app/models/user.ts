export interface User {
    id_user?:number;
    id_role?:number;
    id_type_identification?:number;
    user_name?:string;
    user_lastName?:string;
    email?:string;
    user_address?:string;
    user_document?:string;
    password?:string;
    user_phone?:string
    user_status?:number;
    create_date?: Date;
    updated_at?: Date;
  }
