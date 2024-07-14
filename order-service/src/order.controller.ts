import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('v1/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req);
  }

  @Get()
  orderList(@Req() req: Request) {
    return this.orderService.orderList(req);
  }

  @Get(':id')
  orderDetails(@Req() req: Request, @Param('id') id: string) {
    return this.orderService.orderDetails(req, +id);
  }
}
