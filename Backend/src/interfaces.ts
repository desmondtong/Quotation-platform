export interface RequestBody {
  //auth
  user_id?: number;
  name?: string;
  company?: string;
  email?: string;
  password?: string;
  phone_number?: number;
  role?: string;

  //projects
  customer_id?: number;
  project_name?: string;
  items?: RequestBody[];

  technology?: string;
  material?: string;
  surface_finish?: string;
  item_name?: string;
  quantity?: number;

  "LAST_INSERT_ID()"?: number;
}
