import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Permissionguard } from '../common/guards/permission.guards';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { Permission } from '../common/permissions/permission';

@Controller('user')
@UseGuards(
  AuthGuard('jwt'),
  Permissionguard
)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @RequirePermissions(Permission.USER_READ)
  async findAll() {
    const users = await this.userService.findAll();
    return {
      success: true,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const usertData = await this.userService.findOne(id);
    return {
      success: true,
      message: 'Users data fetched successfully',
      data: usertData,
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    // console.log("id",id)
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.userService.remove(id);
  }
}
