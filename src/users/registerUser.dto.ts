export class RegisterUserDto {
  username: string;
  password: string;
  displayName: string;
  role?: 'admin' | 'user';
}
