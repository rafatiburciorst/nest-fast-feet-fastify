import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CurrentUser } from './current-user.decorator';
import { AuthToken } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }


  @Post('/sign-in')
  async signIn(@Body() createAuthDto: CreateAuthDto) {
    const token = await this.authService.signin(createAuthDto)
    return {
      access_token: token?.accessToken
    }
  }

  @Roles('admin', 'deliveryman')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/me')
  async me(@CurrentUser() user: AuthToken) {
    const userPayload = await this.authService.me(user)
    return {
      user: userPayload.rest
    }
  }

}
