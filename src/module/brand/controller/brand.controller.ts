import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BrandService } from '@/src/module/brand/service/brand.service';
import { Response } from 'express';
import { CreateBrandDto } from '@/src/module/brand/dto/create-brand.dto';
import { UpdateBrandDto } from '@/src/module/brand/dto/update-brand.dto';
import { GetDetailBrandDto } from '@/src/module/brand/dto/get-detail-brand.dto';
import { GetListBrandsDto } from '@/src/module/brand/dto/get-list-brands.dto';

@ApiTags('Brand API')
@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @ApiOperation({
    description: 'Get list brands',
  })
  @Get('')
  async getListBrands(@Query() query: GetListBrandsDto, @Res() res: Response) {
    return this.brandService.getListBrands(query, res);
  }

  @ApiOperation({
    description: 'Get detail brand',
  })
  @ApiParam({ name: 'id', description: 'Brand ID', type: String })
  @Get('/:id')
  async getDetailBrand(
    @Param('id') id: string,
    @Query() query: GetDetailBrandDto,
    @Res() res: Response,
  ) {
    return this.brandService.getDetailBrand(id, query, res);
  }

  @ApiOperation({
    description: 'Create brand name',
  })
  @ApiBody({
    type: CreateBrandDto,
  })
  @Post('')
  async createBrand(@Body() dto: CreateBrandDto, @Res() res: Response) {
    return this.brandService.createBrand(dto, res);
  }

  @ApiOperation({
    description: 'Update brand',
  })
  @ApiBody({
    type: UpdateBrandDto,
  })
  @Put('/:id')
  async updateBrand(
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
    @Res() res: Response,
  ) {
    return this.brandService.updateBrand(id, dto, res);
  }
}
