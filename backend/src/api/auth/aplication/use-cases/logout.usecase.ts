import { Injectable } from '@nestjs/common';
import { SessionsService } from '../../../sessions/sessions.service';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly sessionsService: SessionsService) {}

  async execute(id: string): Promise<boolean> {
    await this.sessionsService.remove(id);
    return true;
  }
}
