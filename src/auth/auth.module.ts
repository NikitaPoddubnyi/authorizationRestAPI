import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthAsyncOptions, AuthOptions, AuthOptionsSymbol } from './interfaces/spotify-options.interface';

@Module({
  // imports: [
  //   PassportModule,
  //   JwtModule.registerAsync({
  //  imports: [ConfigModule],
  //  useFactory: getJwtConfig,
  //  inject: [ConfigService]
  // })],
  // controllers: [AuthController],
  // providers: [AuthService, JwtStrategy],
})
export class AuthModule {
  static forRoot(options: AuthOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [PassportModule, JwtModule.register({
        secret: options.jwtSecret,
        signOptions: {
          algorithm: 'HS256',
          // expiresIn: options.accessTokenExp as any
        },
        verifyOptions: {
          algorithms: ['HS256'],
          ignoreExpiration: false
        }
      })],
      providers: [
        {
          provide: AuthOptionsSymbol,
          useValue: options,
      },
        AuthService,
        JwtStrategy
      ],
      controllers: [AuthController],
      exports: [AuthService],
      // global: true
    }
  }

  static forRootAsync(options: AuthAsyncOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [PassportModule, JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: getJwtConfig,
        inject: [ConfigService]
      }),
    ...(options.imports ?? [])],
      providers: [
        {
          provide: AuthOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
      },
        AuthService,
        JwtStrategy
      ],
      controllers: [AuthController],
      exports: [AuthService],
      // global: true
    }
  }
}