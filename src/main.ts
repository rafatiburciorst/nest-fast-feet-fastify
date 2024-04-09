import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ZodValidationPipe } from 'nestjs-zod'
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false })
  );
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const PORT = configService.get('PORT', { infer: true })

  app.useGlobalPipes(new ZodValidationPipe())
  
  await app.listen(PORT, '0.0.0.0');
})()