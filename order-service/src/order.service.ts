import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItem } from './order.entity';
import { DataSource, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private httpService: HttpService,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, req: Request) {
    try {
      const userId = req['user'].sub;
      const { orderItems } = createOrderDto;

      const user = await this.httpService
        .get(`http://localhost:3000/v1/users/${userId}`, {
          headers: {
            Authorization: req.headers['authorization'],
          },
        })
        .toPromise();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.FAILED_DEPENDENCY);
      }
      let totalPrice = 0;
      for (const item of orderItems) {
        const product = await this.httpService
          .get(`http://localhost:4000/v1/products/${item.productId}`, {
            headers: {
              Authorization: req.headers['authorization'],
            },
          })
          .toPromise();
        if (!product) {
          throw new HttpException(
            'Product not found',
            HttpStatus.FAILED_DEPENDENCY,
          );
        }
        totalPrice += product.data.data.price * item.quantity;
      }
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const savedOrder = await queryRunner.manager.save(Order, {
          userId: userId,
          totalPrice: totalPrice,
          status: 'Pending',
        });
        const items = [];
        for (const item of orderItems) {
          items.push({
            productId: item.productId,
            quantity: item.quantity,
            order: savedOrder,
          });
        }
        await queryRunner.manager.save(OrderItem, items);

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
      return '';
    } catch (error) {
      if (error.status)
        throw new HttpException(error.message, error.getStatus());
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async orderList(req: Request) {
    try {
      const userId = req['user'].sub;
      console.log(userId);
      const results = await this.orderRepository.findAndCount({
        where: { userId: userId },
        select: ['id', 'status', 'totalPrice'],
      });
      return { results: results[0], totalCount: results[1] };
    } catch (error) {
      if (error.status)
        throw new HttpException(error.message, error.getStatus());
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async orderDetails(req: Request, id: number) {
    try {
      const userId = req['user'].sub;
      const result = await this.orderRepository.findOne({
        where: { userId: userId, id: id },
        select: ['id', 'status', 'totalPrice'],
        relations: ['orderItems'],
      });
      if (!result)
        throw new HttpException('No Such Order', HttpStatus.NOT_FOUND);

      return result;
    } catch (error) {
      if (error.status)
        throw new HttpException(error.message, error.getStatus());
      else
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
