import { Prisma } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { z } from 'nestjs-zod/z'

const orderSchema = z.object({
    price: z.coerce.number()
        .refine(value => !isNaN(value), { message: 'Invalid price' })
        .transform(value => new Prisma.Decimal(value)),
    status: z.enum(['waiting', 'dispatched', 'returned']).optional().default('dispatched'),
    size: z.coerce.number(),
    weight: z.coerce.number()
        .refine(value => !isNaN(value), { message: 'Invalid weight' })
        .transform(value => new Prisma.Decimal(value))
})

export type Order = z.infer<typeof orderSchema> & Partial<{ id: string; userId: string | null }>

export class CreateOrderDto extends createZodDto(orderSchema) { }
