import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Request,
  Response,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorators';
import { Tokens } from '../auth/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Public()
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Public()z
  // @Get('/user-panel')
  // @Render('user-panel') // Specify the EJS template file to render
  // userPenal() {
  //   // Your logic to retrieve data and pass it to the template
  //   return { msg: 'sejal' };
  // }
  @Public()
  @Get('/user-panel')
  @Render('user-panel')
  async userPanel(@Request() req, @Response() res) {
    try {
      const users = await this.userService.getAllUser();
      return { users };
    } catch (error) {
      throw error;
    }
  }
  @Public()
  @Post('/insert')
  insertuser(
    @Body() dto: CreateUserDto,
    @Request() req,
    @Response() res,
  ): Promise<Tokens> {
    return this.userService.create(dto, req, res);
  }

  // @Public()
  // @Get('/select')
  // getAllUser(@Request() req, @Response() res) {
  //   return this.userService.getAllUser(req, res);
  // }

  @Public()
  @Post('/delete/:id')
  async deleteUserById(
    @Param('id') id: number,
    @Request() req,
    @Response() res,
  ) {
    return this.userService.deleteUserById(Number(id), res, req); // Convert the id to a number if necessary
  }
  @Public()
  @Post('/edit/:id')
  async editUser(
    @Param('id') id: number,
    @Body() dto: CreateUserDto,
    @Request() req,
    @Response() res,
  ) {
    return this.userService.editUserById(Number(id), dto, res, req);
  }
}
