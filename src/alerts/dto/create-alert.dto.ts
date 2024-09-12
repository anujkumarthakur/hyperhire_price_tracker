import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  chain!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
