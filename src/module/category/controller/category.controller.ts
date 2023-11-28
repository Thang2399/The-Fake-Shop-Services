import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateCategoryDto } from '@/src/module/category/dto/create-category.dto';
import { CategoryService } from '@/src/module/category/service/category.service';
import { GetListCategoriesDto } from '@/src/module/category/dto/get-list-categories.dto';

@ApiTags('Category API')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @ApiOperation({
    description: 'Create category',
  })
  @ApiBody({
    type: CreateCategoryDto,
  })
  @Post('')
  async createCategory(@Body() dto: CreateCategoryDto, @Res() res: Response) {
    return this.categoryService.createCategory(dto, res);
  }

  @ApiOperation({
    description: 'Get list categories',
  })
  @Get('')
  async getListCategories(
    @Query() query: GetListCategoriesDto,
    @Res() res: Response,
  ) {
    return this.categoryService.getListCategories(query, res);
  }

  @ApiOperation({
    description: 'Get detail category',
  })
  @ApiParam({ name: 'id', type: String, description: 'Category Id' })
  @Get('/:id')
  async getDetailCategory(@Param('id') id: string, @Res() res: Response) {
    return this.categoryService.getDetailCategory(id, res);
  }
}
