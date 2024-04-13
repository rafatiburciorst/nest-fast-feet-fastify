import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrderDto, Order } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Pagination } from 'src/utils/pagination';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrderService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) { }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    return this.prisma.order.create({
      data: {
        ...createOrderDto,
        userId
      }
    })
  }

  async update(updateOrderDto: UpdateOrderDto, id: string, userId: string): Promise<Order> {
    return this.prisma.order.update({
      where: {
        id
      },
      data: {
        ...updateOrderDto,
        userId
      }
    })
  }

  async getAllOrders(page: number, limit: number) {

    const orders = await this.prisma.order.findMany({
      take: limit,
      skip: (page - 1) * limit,
    })

    const total = await this.prisma.order.count()
    const meta = new Pagination({ total, limit, page }).paginate()

    return {
      orders,
      meta
    }
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id
      }
    })

    if (!order) throw new BadRequestException('Order does not found')

    const { userId, ...data } = order

    return {
      data
    }
  }

  async deleteOrderById(id: string, sub: string) {

    const { data } = await this.userService.findUserById(sub)

    if (data.role !== 'admin') throw new ForbiddenException('Permission refused')

    return this.prisma.order.delete({
      where: {
        id
      }
    })
  }
}
