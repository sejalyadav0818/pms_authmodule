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

  @Public()
  @Get('/user-penal')
  @Render('user-penal') // Specify the EJS template file to render
  userPenal() {
    // Your logic to retrieve data and pass it to the template
    return { msg: 'sejal' };
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

  @Public()
  @Get('/select')
  getAllUser(@Request() req, @Response() res) {
    return this.userService.getAllUser(req, res);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @Public()
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
