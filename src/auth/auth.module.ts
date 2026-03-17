import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getJwtConfig } from 'src/config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthAsyncOptions, AuthOptions, AuthOptionsSymbol } from './interfaces/auth-options.interface';
import { JwtStrategy } from './strategies/jwt.strategy';

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