export interface RequestBody {
  user_id?: string;
  name?: string;
  company?: string;
  email?: string;
  password?: string | Buffer;
  phone_number?: number;
  role?: string;
}
