import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UserModule, PrismaModule, PassportModule, JwtModule.registerAsync({
    inject: [ConfigService],
    global: true,
    useFactory(config: ConfigService<Env, true>) {
      const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
      const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
      return {
        signOptions: {  algorithm: 'RS256'},
        privateKey: Buffer.from(privateKey, 'base64'),
        publicKey: Buffer.from(publicKey, 'base64'),
      }
    },
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
