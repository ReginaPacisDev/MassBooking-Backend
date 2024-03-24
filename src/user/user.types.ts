export interface AdminCreateUser {
  email: string;
}

export interface GetUser {
  id?: number;
  email?: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  password?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isSuperAdmin: boolean;
}
