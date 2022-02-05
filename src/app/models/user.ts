export interface User {
    id_user?:string;
    user_name?:string;
    user_lastName?:string;
    email?:string;
    password?:string;
    user_phone?:string
    id_role?: number;
    create_date?: Date;
    updated_at?: Date;
  }
