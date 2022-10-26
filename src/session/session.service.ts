import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import * as crypto from 'crypto';
import * as moment from 'moment';

@Injectable()
export class SessionService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  // deleteByUser (userId: string) {
  //   return k('Sessions').where('userId', userId).del();
  // }

  // deleteByToken (token: string) {
  //   return k('Sessions').where('token', token).del();
  // }
  async create(userId: string) {
    const session = {
      session_token: crypto
        .createHash('md5')
        .update(userId + Date.now() + '')
        .digest('base64'),
      expires_at: moment().add(1, 'days').unix(),
      user_id: userId,
    };

    await this.knex.table('Sessions').insert(session);
    return session;
  }
}
