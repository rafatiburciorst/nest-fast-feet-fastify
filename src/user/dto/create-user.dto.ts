import { z } from 'nestjs-zod/z'
import { createZodDto } from 'nestjs-zod'

const createUserDto = z.object({
    name: z.string().min(5),
    cpf: z.string().min(5),
    role: z.enum(['admin', 'user']).default('user'),
    email: z.string().min(5),
    password: z.string().min(5),
})

export type User = z.infer<typeof createUserDto>;

export class CreateUserDto extends createZodDto(createUserDto) { }
