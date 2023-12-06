import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ApiConfigServices } from '@/src/config/api/api-config.service';
import { ApiConfigModule } from '@/src/config/api/api-config.module';
import { ItemsModule } from '@/src/module/item/items.module';
import { InvoiceModule } from '@/src/module/invoice/invoice.module';
import { MongoModule } from '@/src/module/mongo/mongo.module';
import { AuthMiddleware } from '@/src/shared/middleware/token.middleware';
import { RoleMiddleware } from '@/src/shared/middleware/role.middleware';
import { BrandModule } from '@/src/module/brand/brand.module';
import { PaginationModule } from '@/src/shared/module/pagination/pagination.module';
import { CategoryModule } from '@/src/module/category/category.module';
import { StripeModule } from '@/src/module/stripe/stripe.module';
import { PaymentModule } from '@/src/module/payment/payment.module';

const modules = [
  HealthModule,
  ApiConfigModule,
  ItemsModule,
  InvoiceModule,
  BrandModule,
  CategoryModule,
  PaymentModule,
  MongoModule,
  PaginationModule,
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
