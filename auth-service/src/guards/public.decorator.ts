import { SetMetadata } from '@nestjs/common';
import { ENV } from 'src/constants/app.constants';

export const Public = () => SetMetadata(ENV.PUBLIC.DECORATOR, true);
