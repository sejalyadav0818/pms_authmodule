import { ForbiddenException, Injectable, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtPayload, Tokens } from './types';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      // Configure your email service provider details here
      service: 'gmail',
      auth: {
        user: 'codebackup122@gmail.com',
        pass: 'uuceenmlfvmxcnos',
      },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const resetToken = await this.generateSecureToken();

    await this.prisma.user.update({
      where: { email },
      data: { resetToken },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: 'codebackup122@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Your password reset token is: ${resetToken}`,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
    req: Request,
    res: Response,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.resetToken !== token) {
      throw new Error('Invalid reset token');
    }
    const hashedPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetToken: null },
    });
  }

  private async generateSecureToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(20, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf.toString('hex'));
        }
      });
    });
  }

  async signupLocal(
    dto: AuthDto,
    req: Request,
    res: Response,
  ): Promise<Tokens> {
    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user
      .create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hash,
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
    res.redirect('/auth/local/signup');
    return tokens;
  }

  // async signinLocal(
  //   dto: AuthDto,
  //   req: Request,
  //   res: Response,
  // ): Promise<Tokens> {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });

  //   if (!user) throw new ForbiddenException('Access Denied');

  //   const passwordMatches = await argon.verify(user.password, dto.password);
  //   if (!passwordMatches) throw new ForbiddenException('Access Denied');
  //   const tokens = await this.getTokens(user.id, user.email);
  //   await this.updateRtHash(user.id, tokens.refresh_token);
  //   res.render('user-panel');
  //   return tokens;
  // }
  async signinLocal(dto: AuthDto, @Res() res: Response): Promise<Tokens> {
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

    const users = await this.prisma.user.findMany({
      select: { id: true, email: true, name: true },
      where: { isadmin: false },
    });

    res.render('user-panel', { user, users });

    return tokens;
  }
  async logout(userId: number, req: Request, res: Response): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'at-secrect',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'rt-secrect',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
