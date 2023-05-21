// import {
//   Body,
//   Controller,
//   HttpCode,
//   HttpStatus,
//   Post,
//   UseGuards,
//   Render,
//   Get,
//   Request,
//   Response,
// } from '@nestjs/common';
// import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
// import { RtGuard } from '../common/guards';
// import { AuthService } from './auth.service';
// import { AuthDto } from './dto';
// import { Tokens } from './types';

// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Public()
//   @Get('local/signup')
//   @Render('signup') // Specify the EJS template file to render
//   signup() {
//     // Your logic to retrieve data and pass it to the template
//     return { msg: 'sejal' };
//   }
//   @Public()
//   @Post('local/signup')
//   @HttpCode(HttpStatus.CREATED)
//   signupLocal(
//     @Body() dto: AuthDto,
//     @Request() req,
//     @Response() res,
//   ): Promise<Tokens> {
//     return this.authService.signupLocal(dto, req, res);
//   }

//   @Public()
//   @Get('/local/signin')
//   @Render('signin') // Specify the EJS template file to render
//   getLogin() {
//     // Your logic to retrieve data and pass it to the template
//     return { msg: 'sejal' };
//   }
//   // @Public()
//   // @Get('/local/signin')
//   // @Render('signin') // Specify the EJS template file to render
//   // async userPanel(@Request() req, @Response() res) {
//   //   try {
//   //     const users = await this.authService.getAllUser(req, res);
//   //     return { users };
//   //   } catch (error) {
//   //     // Handle the error appropriately
//   //     throw error;
//   //   }
//   // }
//   @Public()
//   @Post('/local/signin')
//   @HttpCode(HttpStatus.OK)
//   signinLocal(
//     @Body() dto: AuthDto,
//     @Request() req,
//     @Response() res,
//   ): Promise<Tokens> {
//     return this.authService.signinLocal(dto, req, res);
//   }

//   @Public()
//   @Get('reset-password')
//   @Render('change-password') // Specify the EJS template file to render
//   password() {
//     // Your logic to retrieve data and pass it to the template
//     return { msg: 'sejal' };
//   }

//   @Public()
//   @Post('reset-password')
//   @HttpCode(HttpStatus.OK)
//   resetPassword(
//     @Body('email') email: string,
//     @Body('token') token: string,
//     @Body('newPassword') newPassword: string,
//     @Request() req,
//     @Response() res,
//   ): Promise<void> {
//     return this.authService.resetPassword(email, token, newPassword, req, res);
//   }

//   @Public()
//   @Get('forget-password')
//   @Render('forget-password') // Specify the EJS template file to render
//   forget() {
//     // Your logic to retrieve data and pass it to the template
//     return { msg: 'sejal' };
//   }

//   // @Public()
//   // @Post('forgot-password')
//   // @HttpCode(HttpStatus.OK)
//   // resetPassword(@Body('email') email: string): Promise<void> {
//   //   return this.authService.resetPassword(email);
//   // }

//   @Public()
//   @Get('logout')
//   @Render('logout') // Specify the EJS template file to render
//   logoutt() {
//     // Your logic to retrieve data and pass it to the template
//     return { msg: 'sejal' };
//   }

//   @Post('logout')
//   @HttpCode(HttpStatus.OK)
//   logout(
//     @GetCurrentUserId() userId: number,
//     @Request() req,
//     @Response() res,
//   ): Promise<boolean> {
//     return this.authService.logout(userId, req, res);
//   }

//   @Public()
//   @Get('darshboard')
//   @Render('darshboard') // Specify the EJS template file to render
//   panell() {
//     // Your logic to retrieve data and pass it to the template
//     return { msg: 'sejal' };
//   }

//   @Public()
//   @UseGuards(RtGuard)
//   @Post('refresh')
//   @HttpCode(HttpStatus.OK)
//   refreshTokens(
//     @GetCurrentUserId() userId: number,
//     @GetCurrentUser('refreshToken') refreshToken: string,
//   ): Promise<Tokens> {
//     return this.authService.refreshTokens(userId, refreshToken);
//   }

//   @Public()
//   @Get('email-verification')
//   @Render('email-verification') // Specify the EJS template file to render
//   verification() {
//     // Your logic to retrieve data and pass it to the template
//     return { msg: 'sejal' };
//   }
// }
import { Body, Controller, Get, Post, Render, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/signup')
  async signupLocal(
    @Body() dto: AuthDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const tokens = await this.authService.signupLocal(dto, req, res);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  @Post('local/signin')
  async signinLocal(@Body() dto: AuthDto, @Res() res: Response): Promise<void> {
    const tokens = await this.authService.signinLocal(dto, res);
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  // @Get('forgot-password')
  // @Render('forgot-password')
  // forgotPassword(): void {}

  @Post('forgot-password')
  async sendResetPasswordEmail(
    @Body('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.forgotPassword(email);
    res.redirect('/auth/forgot-password');
  }

  @Get('reset-password')
  @Render('reset-password')
  resetPassword(@Req() req: Request): { email: string; token: string } {
    return {
      email: req.query.email as string,
      token: req.query.token as string,
    };
  }

  @Post('reset-password')
  async updatePassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.authService.resetPassword(email, token, newPassword, req, res);
    res.redirect('/auth/local/signin');
  }
}
