export interface User {
    id?:string;
    name?:string;
    lastName?:string;
    email?:string;
    password?:string;
    rol: UserRole;
  }

  export enum UserRole{
      Cliente,
      Administrador
  }