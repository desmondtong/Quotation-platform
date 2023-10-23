import { To } from "react-router-dom";

export interface UserContextType {
  accessToken: string;
  setAccessToken: React.Dispatch<React.SetStateAction<string>>;
  claims: Claims;
  setClaims: React.Dispatch<React.SetStateAction<Claims>>;
}

export interface useFetchType {
  (
    endpoint: string,
    method?: string,
    body?: Object,
    token?: string,
    isExtAPI?: boolean
  ): Promise<{}>;
}

export interface data {
  status?: string;
  errors?: string;
  message?: string;
  msg?: string;
  ok?: boolean;
  data?: any;
}

export interface returnValue {
  ok: boolean;
  data: data | any;
}

export interface Claims {
  user_id?: number;
  email?: string;
  name?: string;
  company?: string;
  role?: string;
  phone_number?: number;
}

export interface navBarType {
  item: string;
  link: To;
}

export interface FetchedData {
  // projects
  project_id?: number;
  customer_id?: number;
  project_name?: string;
  datetime?: string;
  is_active?: number;
  is_deleted?: number;
  items?: FetchedData[];

  // items
  item_id?: number;
  technology?: string;
  c_technology?: string;
  material?: string;
  c_material?: string;
  surface_finish?: string;
  c_surface_finish?: string;
  status?: string;
  item_name?: string;
  quantity?: number;

  // quotations
  quotation_id?: number;
  qt_datetime?: string;
  qt_status?: string;
  qt_items?: any;

  // qt_items
  price?: string;
  unit_price?: number;

  // user
  company?: string;
  customer_company?: string;
  customer_email?: string;
  customer_phone_number?: string;
  supplier_company?: string;
  supplier_email?: string;
  supplier_phone_number?: string;
}

export interface Props {
  // quotationListModal
  openQtList?: boolean;
  setOpenQtList?: React.Dispatch<React.SetStateAction<boolean>>;
  itemId?: number;
  setItemId?: React.Dispatch<React.SetStateAction<number>>;

  // createProjectModal
  openCreateModal?: boolean;
  setOpenCreateModal?: React.Dispatch<React.SetStateAction<boolean>>;
  getAllCustomerProjects?: () => Promise<void>;

  // createQuoteModal
  openNewQuote?: boolean;
  setOpenNewQuote?: React.Dispatch<React.SetStateAction<boolean>>;
  itemInfo?: FetchedData;
  projectId?: string;
}
