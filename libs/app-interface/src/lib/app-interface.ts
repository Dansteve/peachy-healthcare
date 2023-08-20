import { User } from './user.entity';

export interface AnyInfo {
  [key: string | symbol]: any;
}

export interface LoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}


export interface ForgetPasswordPayload {
  username: string;
  password?: string;
  rememberMe?: boolean;
}


export interface ResetPasswordPayload {
  password?: string;
  confirmPassword?: string;
  resetId?: string;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  gender?: string;
  username: string;
  phoneNumber: string;
  age?: number;
  password: string;
  address: AddressPayload;
}

export interface AddressPayload {
  search: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  formatted_address?: string[];
  thoroughfare?: string;
  building_name?: string;
  sub_building_name?: string;
  sub_building_number?: string;
  building_number?: string;
  line_1: string;
  line_2: string;
  line_3?: string;
  line_4?: string;
  locality?: string;
  town_or_city: string;
  county: string;
  district?: string;
  country?: string;
  residential?: boolean;
  [key: string | symbol]: any;
}



export interface AuthenticatedToken {
  [key: string | symbol]: any;
  token: string;
  user: User;
}

export interface GenericApiResponse<TType = unknown> {
  [key: string | symbol]: any;
  readonly status: number;
  readonly message: string;
  readonly title: string;
  readonly data?: TType;
}

export interface ApiErrorResponse extends GenericApiResponse<string> {
  readonly isError?: true;
}

// export interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   age: number;
//   phone: string;
//   password: string;
//   address: AddressPayload;
//   gender: string;
//   [key: string | symbol]: any;
// }

export type UserLoginDTO = Pick<User, 'username' | 'password'>;

export type UserDetails = Omit<User, 'password'>;

export interface ResponseData<T = unknown> {
  data: T;
  message: string;
  status: number;
};
