import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './current-user.decorator';
import { TokenSchema } from './jwt.strategy';

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

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async me(@CurrentUser() user: TokenSchema) {
    const userPayload = await this.authService.me(user)
    return {
      user: userPayload.rest
    }
  }

}
