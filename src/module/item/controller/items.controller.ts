import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetListItemsDto } from '@/src/module/item/dto/get-list-items.dto';
import { ItemsServices } from '@/src/module/item/service/items.service';
import { CreateItemDto } from '@/src/module/item/dto/create-item.dto';
import { Response } from 'express';
import { DeleteItemsDto } from '@/src/module/item/dto/delete-items.dto';
import { UpdateItemDto } from '@/src/module/item/dto/update-item.dto';
import { AuthMiddleware } from '@/src/shared/middleware/auth.middleware';
import { TokenGuard } from '@/src/shared/guard/token.guard';
import { RoleGuard } from '@/src/shared/guard/role.guard';

@ApiTags('Items API')
@ApiBearerAuth()
@Controller('items')
export class ItemsController {
  constructor(private itemsServices: ItemsServices) {}

  @ApiOperation({
    description: 'Get list items',
  })
  // @UseGuards(RoleGuard)
  @Get('')
  async getListItems(@Query() query: GetListItemsDto, @Res() res: Response) {
    return this.itemsServices.getListItems(query, res);
  }

  @ApiOperation({
    description: 'Get item information',
  })
  @ApiParam({ name: 'id', description: 'Item ID', type: String })
  @Get('/:id')
  async getDetailItem(@Param('id') id: string) {
    return this.itemsServices.getDetailItem(id);
  }

  @ApiOperation({
    description: 'Delete item',
  })
  @ApiBody({
    type: DeleteItemsDto,
  })
  @Delete('')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItems(@Body() dto: DeleteItemsDto) {
    return this.itemsServices.deleteItems(dto);
  }

  @ApiOperation({
    description: 'Create item',
  })
  @ApiBody({
    type: CreateItemDto,
  })
  @Post('/create-item')
  @HttpCode(HttpStatus.CREATED)
  async createItem(@Body() dto: CreateItemDto, @Res() res: Response) {
    return this.itemsServices.createItem(dto, res);
  }

  @ApiOperation({
    description: 'Update item',
  })
  @ApiBody({
    type: UpdateItemDto,
  })
  @ApiParam({ name: 'id', description: 'Item ID', type: String })
  @Put('/update-item/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @Res() res: Response,
  ) {
    return this.itemsServices.updateItem(id, dto, res);
  }
}
