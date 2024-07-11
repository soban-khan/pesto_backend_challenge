import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.register.dto';
import { LoginDto } from './login.dto';
import { Public } from './guards/public.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('v1/users')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Public()
  @Post('v1/login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}
