import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('v1/health')
  health() {
    return this.orderService.health();
  }
}
