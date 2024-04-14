import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        const userExistCpf = await this.findUserByCpf(createUserDto.cpf)
        if (userExistCpf) throw new ConflictException('User already exists')

        const userExistEmail = await this.findUserByCpf(createUserDto.cpf)
        if (userExistEmail) throw new ConflictException('User already exists')

        const hashedPassword = await this.hashPassword(createUserDto.password)
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword
            }
        })

        const { password, ...rest } = user
        return rest
    }

    private async hashPassword(password: string): Promise<string> {
        console.log(password)
        const salt = 8
        const hashedPassword = await hash(password, salt)
        return hashedPassword
    }

    async findUserByCpf(cpf: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                cpf
            },
            select: {
                id: true,
                name: true,
                email: true,
                cpf: true,
                password: true
            }
        })

        if (!user) return null
        return user
    }

    async findUserByEmail(email: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            },
            select: {
                id: true,
                name: true,
                email: true,
                cpf: true,
                password: true,
                role: true
            }
        })

        if (!user) return null
        return user
    }

    async findUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) throw new BadRequestException('User not found')

        const { password, ...data } = user

        return {
            data
        }
    }
}
