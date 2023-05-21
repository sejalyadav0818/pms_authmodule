import { IsEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  name: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}
