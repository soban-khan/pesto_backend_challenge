import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      await this.productRepository.save(createProductDto);
      return {};
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

  async list() {
    try {
      const results = await this.productRepository.findAndCount({
        order: {
          id: 'ASC',
        },
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

  async detail(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
      });
      if (!product)
        throw new HttpException('No Such Product', HttpStatus.NOT_FOUND);

      return product;
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const productToUpdate = await this.productRepository.findOne({
        where: { id },
      });
      if (!productToUpdate)
        throw new HttpException('Product Does Not Exist', HttpStatus.NOT_FOUND);

      this.productRepository.merge(productToUpdate, updateProductDto);

      await this.productRepository.save(productToUpdate);
      return {};
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

  async remove(id: number) {
    try {
      const deletedProduct = await this.productRepository.delete(id);
      if (!deletedProduct.affected)
        throw new HttpException('No Such Product', HttpStatus.NOT_FOUND);

      return {};
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
