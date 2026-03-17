import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginDto {
	@ApiProperty({
		description: 'Email пользователя',
		example: 'hM0aR@example.com',
		type: String,
		required: true,
	}
	)
	@IsEmail()
	@IsNotEmpty({ message: 'Email не должен быть пустым' })
	email: string;
	
	@ApiProperty({
		description: 'Пароль пользователя',
		example: 'rdgttsdv23',
		type: String,
		required: true,
		minLength: 6,
		maxLength: 128,
	}
	)
	@IsNotEmpty({ message: 'Пароль не должен быть пустым' })
	@MinLength(6, { message: 'Пароль не должен быть короче 6 символов' })
	@MaxLength(128, { message: 'Пароль не должен превышать 50 символов' })
	@IsNotEmpty({ message: 'Пароль не должен быть пустым' })
	password: string;
}