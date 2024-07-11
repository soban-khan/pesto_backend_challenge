import { SetMetadata } from '@nestjs/common';
import { ENV } from './app.constants';

export const Public = () => SetMetadata(ENV.PUBLIC.DECORATOR, true);
