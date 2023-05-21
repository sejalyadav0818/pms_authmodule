import { IsEmpty, IsString } from 'class-validator';

export class AuthDto {
  name: string;
  email: string;
  password: string;
  googleid: string;
}
