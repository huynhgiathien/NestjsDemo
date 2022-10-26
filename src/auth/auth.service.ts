import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { AuthCredentialsDto } from './auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { SessionService } from '../session/session.service';
import { Session } from '../session/session.model';
import moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private sessionService: SessionService,
  ) {}

  async signIn(authCredentialDto: AuthCredentialsDto): Promise<Session> {
    const { email, password } = authCredentialDto;
    const user = await this.knex.table('Users').where('email', email).first();
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return await this.sessionService.create(user.user_id);
  }

  async verifySessionToken(session: string) {
    const currentTimestamp = moment().unix();
    const sessionInfo = (await this.knex.table('Sessions')) as Session;
    if (sessionInfo) {
      if (currentTimestamp >= sessionInfo.expires_at) {
        await this.knex
          .table('Sessions')
          .where('session_token', session)
          .delete();
        throw new UnauthorizedException('Session expired');
      } else {
        await this.knex
          .table('Sessions')
          .where('session_token', session)
          .delete();
      }
    }
  }
}
