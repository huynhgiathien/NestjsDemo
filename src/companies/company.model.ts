export interface Company {
  company_id?: number;
  name?: string;
  hidden?: boolean;
  created_at?: Date;
  updated_at?: Date;
  short_name?: string;
  is_partner_company?: boolean;
  sort?: number;
}
