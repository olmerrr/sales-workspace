import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { User } from '../users/user.entity';
import { Session } from './session.entity';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/user.entity';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET ?? 'access_secret_dev';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET ?? 'refresh_secret_dev';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      bio: dto.bio,
      role: UserRole.USER,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.createSessionAndTokens(savedUser);
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSessionAndTokens(user);
  }

  async logout(dto: LogoutDto) {
    let payload: { sub: number; jti: string };

    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.sessionsRepository.findOne({
      where: { userId: payload.sub, jti: payload.jti },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (!session.revokedAt) {
      session.revokedAt = new Date();
      await this.sessionsRepository.save(session);
    }

    return { ok: true };
  }

  async refresh(dto: RefreshDto) {
    let payload: { sub: number; jti: string };

    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.sessionsRepository.findOne({
      where: { userId: payload.sub, jti: payload.jti },
    });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.revokedAt) {
      throw new UnauthorizedException('Session revoked');
    }

    if (session.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Session expired');
    }

    const tokenMatches = await bcrypt.compare(
      dto.refreshToken,
      session.refreshTokenHash,
    );

    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    session.revokedAt = new Date();
    await this.sessionsRepository.save(session);

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.createSessionAndTokens(user);
  }

  private async createSessionAndTokens(user: User) {
    const jti = randomUUID();

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, role: user.role },
      { secret: ACCESS_TOKEN_SECRET, expiresIn: '15m' },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, jti },
      { secret: REFRESH_TOKEN_SECRET, expiresIn: '7d' },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = this.sessionsRepository.create({
      userId: user.id,
      jti,
      refreshTokenHash,
      expiresAt,
      revokedAt: null,
    });

    await this.sessionsRepository.save(session);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}
