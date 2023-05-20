import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Render,
  Get,
  Request,
  Response,
} from '@nestjs/common';
import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { RtGuard } from '../common/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('local/signup')
  @Render('signup') // Specify the EJS template file to render
  signup() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }
  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(
    @Body() dto: AuthDto,
    @Request() req,
    @Response() res,
  ): Promise<Tokens> {
    return this.authService.signupLocal(dto, req, res);
  }

  @Public()
  @Get('/local/signin')
  @Render('signin') // Specify the EJS template file to render
  getLogin() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(
    @Body() dto: AuthDto,
    @Request() req,
    @Response() res,
  ): Promise<Tokens> {
    return this.authService.signinLocal(dto, req, res);
  }

  @Public()
  @Get('reset-password')
  @Render('change-password') // Specify the EJS template file to render
  password() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
    @Response() res,
  ): Promise<void> {
    return this.authService.resetPassword(email, token, newPassword, req, res);
  }

  @Public()
  @Get('forget-password')
  @Render('forget-password') // Specify the EJS template file to render
  forget() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  // @Public()
  // @Post('forgot-password')
  // @HttpCode(HttpStatus.OK)
  // resetPassword(@Body('email') email: string): Promise<void> {
  //   return this.authService.resetPassword(email);
  // }

  @Public()
  @Get('logout')
  @Render('logout') // Specify the EJS template file to render
  logoutt() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: number,
    @Request() req,
    @Response() res,
  ): Promise<boolean> {
    return this.authService.logout(userId, req, res);
  }

  @Public()
  @Get('user-panel')
  @Render('user-panel') // Specify the EJS template file to render
  panel() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }
  @Public()
  @Get('darshboard')
  @Render('darshboard') // Specify the EJS template file to render
  panell() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Public()
  @Get('email-verification')
  @Render('email-verification') // Specify the EJS template file to render
  verification() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }
}
