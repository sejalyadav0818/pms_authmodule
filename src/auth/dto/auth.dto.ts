import { IsEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmpty()
  name: string;
  @IsString()
  @IsEmpty()
  email: string;
  @IsString()
  @IsEmpty()
  password: string;
}
