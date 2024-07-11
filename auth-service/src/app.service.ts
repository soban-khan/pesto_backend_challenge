import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENV } from './app.constants';
import { CreateUserDto } from './user.register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      await this.userRepository.save(createUserDto);

      return {};
    } catch (error) {
      if (error.status)
        throw new HttpException(error.message, error.getStatus());
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!user)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid)
        throw new HttpException('Incorrect Password', HttpStatus.UNAUTHORIZED);
      const jwtPayload = {
        sub: user.id,
        email: user.email,
      };
      const accessToken = await this.jwtService.signAsync(jwtPayload, {
        secret: ENV.JWT.SECRET,
        expiresIn: ENV.JWT.EXPIRY,
      });
      return { accessToken };
    } catch (error) {
      if (error.status)
        throw new HttpException(error.message, error.getStatus());
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
