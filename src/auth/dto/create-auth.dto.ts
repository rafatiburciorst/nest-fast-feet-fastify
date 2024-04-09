import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";


const createAuthDto = z.object({
    email: z.string().email().optional(),
    cpf: z.string().optional(),
    password: z.string(),
}).required()


export class CreateAuthDto extends createZodDto(createAuthDto) {}
