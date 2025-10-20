import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { RegisterUserDto } from './registerUser.dto';
import { LoginUserDto } from './login-user.dto';
import { AuthService } from '../auth/auth.service';
import { type RequestWithUser, TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  @Post()
  async registerUser(@Body() userData: RegisterUserDto) {
    const user = new this.userModel({
      username: userData.username,
      password: userData.password,
      displayName: userData.displayName,
      role: userData.role || 'user',
    });

    user.generateToken();
    return user.save();
  }

  @Post('sessions')
  async login(@Body() userData: LoginUserDto) {
    const { username, password } = userData;
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @UseGuards(TokenAuthGuard)
  @Delete('sessions')
  async logout(@Req() req: RequestWithUser) {
    req.user.generateToken();
    await req.user.save();
    return { message: 'Logged out successfully' };
  }

  @UseGuards(TokenAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
