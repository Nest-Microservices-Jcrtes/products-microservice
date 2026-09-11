import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main')
  // Pra hacer uso de esto se instalo con el comando pnpm add @nestjs/microservices, esto es para poder crear microservicios con NestJS
  //  el createMicroservice es para crear un microservicio, en este caso se esta creando un microservicio TCP
  // el <MicroserviceOptions> es para decirle a NestJS que este microservicio va a tener opciones de transporte, en este caso TCP
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    // AppModule es el modulo principal de la aplicación, en este caso es el modulo que contiene todos los controladores y servicios de la aplicación ese viene de 
    // src/app.module.ts
    AppModule,
  {
    // Se crea un microservicio TCP, en este caso se esta creando un microservicio TCP que escucha en el puerto 3001
    transport: Transport.TCP,
    options: {
      port: envs.port
    }
  });
  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
      }) 
  );
    await app.listen( );
    logger.log(`Products Microservice  running on port ${ envs.port }`);
}
bootstrap();
