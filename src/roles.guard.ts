import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Knex } from 'knex';
import * as moment from 'moment';
import { InjectModel } from 'nest-knexjs';
import { Session } from './session/session.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('role', context.getHandler());
    if (!roles) {
      return true;
    }

    const session = context.switchToHttp().getRequest().headers[
      'authorization'
    ];

    if (!session) {
      throw new UnauthorizedException();
    }

    const user = await this.verifySessionToken(session);

    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatched = matchRoles(roles, user.role);
    if (!isMatched) {
      throw new UnauthorizedException();
    }
    return true;
  }

  async verifySessionToken(session: string) {
    const currentTimestamp = moment().unix();
    const sessionInfo = (await this.knex
      .table('Sessions')
      .where('session_token', session)
      .first()) as Session;
    if (sessionInfo) {
      if (currentTimestamp >= sessionInfo.expires_at) {
        await this.knex
          .table('Sessions')
          .where('session_token', session)
          .delete();
        throw new UnauthorizedException('Session expired');
      }

      const userInfo = await this.knex
        .table('Users')
        .leftJoin('Sessions', 'Users.user_id', 'Sessions.user_id')
        .where('Sessions.session_token', session)
        .select(
          'Users.user_id as user_id',
          'first_name',
          'middle_name',
          'last_name',
          'role',
        )
        .first();

      return userInfo;
    }
    throw new UnauthorizedException('Session expired');
  }
}

function matchRoles(
  roles: number[],
  userRole: number,
): boolean | PromiseLike<boolean> {
  if (roles.includes(userRole)) return true;
  else return false;
}
