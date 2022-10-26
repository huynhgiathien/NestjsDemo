import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  user_id: number;

  first_name: string;

  last_name: string;

  email: string;

  branch_id: number;

  department_id: number;

  position_id: number;

  role: number;

  full_time: boolean;
}
