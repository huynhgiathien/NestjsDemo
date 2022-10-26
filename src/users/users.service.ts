import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './createUserDto';
import { User } from './user.model';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async getAllUsers(): Promise<User[]> {
    const users = await this.knex.table('Users');
    if (users.length === 0) {
      throw new NotFoundException(`Not found`);
    }
    return users;
  }

  async getUserById(user_id: number): Promise<User> {
    const user = await this.knex
      .table('Users')
      .where('user_id', user_id)
      .first();
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }
    return user;
  }

  // Update Users delete (Sorf delete)
  async updateUserIsDeleted(
    user_id: number,
    is_deleted: boolean,
  ): Promise<User[]> {
    const user = await this.getUserById(user_id);

    return await this.knex
      .table('Users')
      .where('user_id', user.user_id)
      .update('is_deleted', is_deleted)
      .returning('*');
  }

  // getUserById(id: number): User {
  //   const user = this.users.find((user) => user.user_id === id);
  //   if (!user) {
  //     throw new NotFoundException(`User with id ${id} not found`);
  //   }
  //   return user;
  // }

  // createUser(payload: CreateUserDto): User {
  //   const user: User = {
  //     user_id: payload.user_id,
  //     first_name: payload.first_name,
  //     last_name: payload.last_name,
  //     email: payload.email,
  //     branch_id: payload.branch_id,
  //     department_id: payload.department_id,
  //     position_id: payload.position_id,
  //     role: payload.role,
  //     full_time: payload.full_time,
  //   };
  //   this.users.push(user);
  //   return user;
  // }

  // deleteUser(user_id: number): void {
  //   const userFound = this.getUserById(user_id);
  //   this.users = this.users.filter(
  //     (user) => user.user_id !== userFound?.user_id,
  //   );
  // }
}
