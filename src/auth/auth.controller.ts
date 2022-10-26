import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('/sign-in')
  signIn(@Body() authCredentialDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialDto);
  }
}
