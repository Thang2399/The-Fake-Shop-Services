import { Module } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CategoryController } from './controller/category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '@/src/schema/category.schema';
import { PaginationService } from '@/src/shared/module/pagination/service/pagination.service';
import { PaginationModule } from '@/src/shared/module/pagination/pagination.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
    PaginationModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, PaginationService],
})
export class CategoryModule {}
