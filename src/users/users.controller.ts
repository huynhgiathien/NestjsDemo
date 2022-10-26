import {
  Body,
  Controller,
  Get,
  Put,
  HttpStatus,
  Param,
  ParseIntPipe,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/logging.interceptor';

import { User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  @UseInterceptors(LoggingInterceptor)
  getUserById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Put('/:id/is_deleted')
  @SetMetadata('role', [1, 3])
  @UseInterceptors(LoggingInterceptor)
  async updateUserIsDeleted(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body('is_deleted') is_deleted: boolean,
  ): Promise<User[]> {
    return this.usersService.updateUserIsDeleted(id, is_deleted);
  }
}
