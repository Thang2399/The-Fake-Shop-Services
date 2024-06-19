import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateCategoryDto } from '@/src/module/category/dto/create-category.dto';
import { CategoryService } from '@/src/module/category/service/category.service';
import { GetListCategoriesDto } from '@/src/module/category/dto/get-list-categories.dto';
import { GetCategoriesWithTypicalItemsDto } from '@/src/module/category/dto/get-categories-typical-items.dto';
import { UpdateCategoryDto } from '@/src/module/category/dto/update-category.dto';
import { RoleGuard } from '@/src/shared/guard/role.guard';

@ApiTags('Category API')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @ApiOperation({
    description: 'Create category',
  })
  @ApiBody({
    type: CreateCategoryDto,
  })
  @UseGuards(RoleGuard)
  @Post('')
  async createCategory(@Body() dto: CreateCategoryDto, @Res() res: Response) {
    return this.categoryService.createCategory(dto, res);
  }

  @ApiOperation({
    description: 'Get list categories with typical 10 items',
  })
  @Get('typical-items')
  async getCategoriesWithTypicalItems(
    @Query() query: GetCategoriesWithTypicalItemsDto,
    @Res() res: Response,
  ) {
    return this.categoryService.getCategoriesWithTypicalItems(query, res);
  }

  @ApiOperation({
    description: 'Get list categories',
  })
  @UseGuards(RoleGuard)
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

  @ApiOperation({
    description: 'Update category',
  })
  @ApiParam({ name: 'id', type: String, description: 'Category Id' })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  @UseGuards(RoleGuard)
  @Put('/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    return this.categoryService.updateCategory(id, dto, res);
  }
}
