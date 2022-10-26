import {
  IsBoolean,
  IsNotEmpty,
  Length,
  MaxLength,
  MinLength,
  validate,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsNotEmpty()
  company_id: number;

  name: string;

  hidden: boolean;

  created_at: Date;

  updated_at: Date;

  @MaxLength(50)
  short_name?: string;

  is_partner_company: number;

  sort: number;
}
