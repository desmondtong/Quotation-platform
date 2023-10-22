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
  user_id: number;
  email: string;
  name: string;
  company: string;
  role: string;
  phone_number: number;
}
