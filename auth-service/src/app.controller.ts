import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './public.decorator';
import { CreateUserDto } from './user.register.dto';
import { LoginDto } from './login.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('v1/users')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.appService.registerUser(createUserDto);
  }

  @Public()
  @Post('v1/login')
  login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }
}
