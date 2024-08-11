export class UserDto {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: string;
}

export interface CreateUserDto {
  email: string;
  name?: string;
  isSuperAdmin?: boolean;
  password: string;
}
