import { IsEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  name: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString()
  googleid: string;
}
