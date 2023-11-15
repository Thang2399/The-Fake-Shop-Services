import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './module/health/health.module';
import { ApiConfigServices } from '@/src/config/api/api-config.service';
import { ApiConfigModule } from '@/src/config/api/api-config.module';
import { ItemsModule } from '@/src/module/item/items.module';
import { InvoiceModule } from '@/src/module/invoice/invoice.module';
import { MongoModule } from '@/src/module/mongo/mongo.module';
import { AuthMiddleware } from '@/src/shared/middleware/token.middleware';
import { RoleMiddleware } from '@/src/shared/middleware/role.middleware';

const modules = [
  HealthModule,
  ApiConfigModule,
  ItemsModule,
  InvoiceModule,
  MongoModule,
];

@Module({
  imports: modules,
  controllers: [],
  providers: [ApiConfigServices],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply the AuthMiddleware to all routes
    consumer.apply(AuthMiddleware, RoleMiddleware).forRoutes('*');
  }
}
