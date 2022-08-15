import { User } from "./user";

export interface Auditory {
    id_audit: number;
    user: User;
    audit_action: string;
    audit_module: string;
    audit_query: string;
    audit_description: string;
    create_date: Date;
    updated_at: Date;
}
