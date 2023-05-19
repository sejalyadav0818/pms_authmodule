import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

import { AuthDto } from './dto';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  private refreshTokenStorage: Record<number, string> = {}; // Refresh token storage

  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user
      .create({
        data: {
          name: dto.name,
          email: dto.email,
          password: await argon.hash(dto.password),
          googleid: dto.googleid,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await delete this.refreshTokenStorage[userId]; // Remove the refresh token from local storage

    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const storedRefreshToken = this.refreshTokenStorage[userId]; // Retrieve the refresh token from local storage

    if (!storedRefreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(storedRefreshToken, rt);

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    this.updateRtHash(user.id, tokens.refresh_token); // Update the stored refresh token

    return tokens;
  }

  updateRtHash(userId: number, rt: string): void {
    this.refreshTokenStorage[userId] = rt; // Store refresh token locally
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'hcnukhwncwkhnciwhn',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'nfcejkewnvkwenvewnl',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
