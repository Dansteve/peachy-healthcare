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

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  gender?: string;
  username: string;
  phoneNumber: string;
  age?: number;
  password: string;
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

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
  password: string;
  address: string;
  gender: string;
  [key: string | symbol]: any;
}

export type UserLoginDTO = Pick<User, 'username' | 'password'>;

export type UserDetails = Omit<User, 'password'>;

export interface ResponseData<T = unknown> {
  data: T;
  message: string;
  status: number;
};
