import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  async health() {
    try {
      return 'Healthy';
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
