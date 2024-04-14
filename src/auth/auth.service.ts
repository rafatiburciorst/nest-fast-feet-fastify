import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from './jwt.strategy';


@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwt: JwtService
  ) { }

  async signin(createAuthDto: CreateAuthDto) {
    if (createAuthDto.cpf) {
      const user = await this.userService.findUserByCpf(createAuthDto.cpf)
      if (!user) throw new UnauthorizedException('User credentials do not match')
      const isValidPassword = await compare(createAuthDto.password, user.password)
      if (!isValidPassword) throw new UnauthorizedException('User credentials do not match')

      const accessToken = this.jwt.sign({
        sub: user.id
      })

      return {
        accessToken
      }
    }

    if (createAuthDto.email) {
      const user = await this.userService.findUserByEmail(createAuthDto.email)
      if (!user) throw new UnauthorizedException('User credentials do not match')
      const isValidPassword = await compare(createAuthDto.password, user.password)
      if (!isValidPassword) throw new UnauthorizedException('User credentials do not match')

      const accessToken = this.jwt.sign({
        sub: user.id,
        roles: user.role
      })

      return {
        accessToken
      }
    }
  }

  async me(userToken: AuthToken) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userToken.sub
      }
    })

    if (!user) throw new BadRequestException('User not found')

    const { password, ...rest } = user
    return {
      rest
    }
  }
}
