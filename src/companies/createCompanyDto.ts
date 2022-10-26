import { IsBoolean, IsNotEmpty, Length, MaxLength } from 'class-validator';
export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  hidden: boolean;

  created_at: Date;

  updated_at: Date;

  @MaxLength(50)
  short_name: string;

  is_partner_company: number;

  sort: number;
}
