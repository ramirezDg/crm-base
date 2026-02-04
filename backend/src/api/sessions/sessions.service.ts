import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { IsNull, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const session = this.sessionRepository.create(createSessionDto);
    return await this.sessionRepository.save(session);
  }

  async findAll() {
    return await this.sessionRepository.find({
      where: { deleted_at: IsNull() },
    });
  }

  async findOne(id: string) {
    return await this.sessionRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
  }

  async findActiveSession(jwt: string) {
    const sessions = await this.sessionRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['company'],
    });

    for (const session of sessions) {
      if (await bcrypt.compare(jwt, session.hashedAt)) {
        return session;
      }
    }
    return null;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    await this.sessionRepository.update({ id }, updateSessionDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.sessionRepository.softDelete(id);
    return { deleted: true };
  }
}
