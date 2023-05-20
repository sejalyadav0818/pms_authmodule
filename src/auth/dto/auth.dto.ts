import { IsEmpty, IsString } from 'class-validator';

export class AuthDto {
  name: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  googleid: string;
}
