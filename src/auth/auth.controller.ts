import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto';
import { JwtGuard } from './guards/auth.guard';
import { Authorization } from './decorators/auth.decorator';
import { Authorized } from './decorators/authed.decorator';
import  type { User } from '../generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
     description: 'Пользователь успешно зарегистрирован',
     type: AuthResponse })
  @ApiBadRequestResponse({ description: 'Некоректные данные пользователя ' })
  @ApiConflictResponse({ description: 'Пользователь с таким email уже существует' })
  @ApiOperation({ summary: 'Регистрирует пользователя', description: 'Регистрирует пользователя' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Res({passthrough: true}) res: Response, @Body() dto: RegisterRequest){
    return this.authService.register(res, dto)
  }

   @ApiOkResponse({
     description: 'Пользователь успешно зарегистрирован',
     type: AuthResponse })
  @ApiBadRequestResponse({ description: 'Некоректные данные пользователя ' })
  @ApiNotFoundResponse({ description: 'Пользователь с таким email уже существует' })
  @ApiOperation({ summary: 'Авторизует пользователя', description: 'Авторизует пользователя и дает refresh и access токены' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Res({passthrough: true}) res: Response, @Body() dto: LoginDto){
    return this.authService.login(res, dto)
  }

 @ApiOkResponse({
     description: 'Пользователь успешно зарегистрирован',
     type: AuthResponse })
  @ApiUnauthorizedResponse({ description: 'Недействительные refresh токены' })
  @ApiOperation({ summary: 'Обновляет access и refresh токены', description: 'Обновляет access и refresh токены' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response){
    return this.authService.refresh(req, res)
  }

  @ApiOperation({ summary: 'Выход из аккаунта', description: 'Выход из аккаунта' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({passthrough: true}) res: Response){
    return this.authService.logout(res)
  }

@Authorization()
// @UseGuards(JwtGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@Authorized() user: User){
    return user
  }
}
