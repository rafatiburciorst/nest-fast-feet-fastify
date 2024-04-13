import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true,
  }), AuthModule, UserModule, PrismaModule, OrderModule,],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ]
})
export class AppModule { }
