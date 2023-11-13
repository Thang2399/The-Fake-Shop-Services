import { Module } from '@nestjs/common';
import { HealthModule } from './module/health/health.module';
import { ApiConfigServices } from '@/src/config/api/api-config.service';
import { ApiConfigModule } from '@/src/config/api/api-config.module';

const modules = [HealthModule, ApiConfigModule];

@Module({
  imports: [...modules],
  controllers: [],
  providers: [ApiConfigServices],
})
export class AppModule {}
