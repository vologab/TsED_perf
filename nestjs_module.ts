import { Module } from '@nestjs/common';
import { AppController } from './nestjs_controller';

@Module({
  imports: [],
  controllers: [AppController],
  components: [],
})
export class ApplicationModule {}