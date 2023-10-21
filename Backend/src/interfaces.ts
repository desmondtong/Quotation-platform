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
  project_id?: number;
  customer_id?: number;
  project_name?: string;
  is_active?: string;

  items?: RequestBody[];

  // items
  item_id?: number;
  technology?: string;
  material?: string;
  surface_finish?: string;
  item_name?: string;
  status?: string;
  quantity?: number;

  "LAST_INSERT_ID()"?: number;

  // quotations
  supplier_id?: number;

  // qt_items
  unit_price?: number;

  "SUM(price)"?: number;

  qt_items?: RequestBody[];
}
