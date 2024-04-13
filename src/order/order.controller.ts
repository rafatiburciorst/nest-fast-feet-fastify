import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Put, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenSchema } from 'src/auth/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('/orders')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() { sub }: TokenSchema) {
    return this.orderService.create(createOrderDto, sub)
  }


  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() updateOrderDto: UpdateOrderDto, @Param() id: string, @CurrentUser() { sub }: TokenSchema) {
    return this.orderService.update(updateOrderDto, id, sub)
  }

  @Get()
  async getAllOrders(@Query('page') page: string, @Query('limit') limit: string) {
    const { orders: data, meta } = await this.orderService.getAllOrders(+page, +limit)
    return {
      data,
      meta
    }
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    const { data } = await this.orderService.getOrderById(id)
    return {
      data
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrderById(@Param('id') id: string, @CurrentUser() { sub }: TokenSchema) {
    return this.orderService.deleteOrderById(id, sub)
  }
}
