import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Render,
  Get,
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
  @Get('signin')
  @Render('signin') // Specify the EJS template file to render
  getLogin() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @Get('signin')
  @Render('signin') // Specify the EJS template file to render
  signini() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @Get('signup')
  @Render('signup') // Specify the EJS template file to render
  signup() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @Get('change-password')
  @Render('change-password') // Specify the EJS template file to render
  password() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @Get('email-verification')
  @Render('email-verification') // Specify the EJS template file to render
  verification() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @Get('forget-password')
  @Render('forget-password') // Specify the EJS template file to render
  forget() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }

  @Public()
  @Get('logout')
  @Render('logout') // Specify the EJS template file to render
  logoutt() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }
  @Public()
  @Get('user-panel')
  @Render('user-panel') // Specify the EJS template file to render
  panel() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
  }
  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
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
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body('email') email: string): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    return this.authService.resetPassword(email, token, newPassword);
  }
}
