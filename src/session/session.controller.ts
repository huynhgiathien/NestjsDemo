import { Controller } from '@nestjs/common';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  sessionService: SessionService;
  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }
}
