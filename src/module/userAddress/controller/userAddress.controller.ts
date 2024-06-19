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
  ApiTags,
} from '@nestjs/swagger';
import { UserAddressService } from '@/src/module/userAddress/service/userAddress.service';
import { CreateUserAddressDto } from '@/src/module/userAddress/dto/create-user-address.dto';
import { Response } from 'express';
import { TokenGuard } from '@/src/shared/guard/token.guard';
import { GetListUserAddressesDto } from '@/src/module/userAddress/dto/get-list-user-addresses.dto';
import { DeleteUserAddressesDto } from '@/src/module/userAddress/dto/delete-user-addresses.dto';
import { UpdateUserAddressDto } from '@/src/module/userAddress/dto/update-user-address.dto';

@ApiTags('User Address API')
@ApiBearerAuth()
@UseGuards(TokenGuard)
@Controller('user-address')
export class UserAddressController {
  constructor(private userAddressService: UserAddressService) {}

  @ApiOperation({
    description: 'Get list user addresses',
  })
  @Get('')
  async getListUserAddresses(
    @Query() query: GetListUserAddressesDto,
    @Res() res: Response,
  ) {
    return this.userAddressService.getListUserAddresses(query, res);
  }

  @ApiOperation({
    description: 'Get detail user addresses',
  })
  @ApiParam({ name: 'id', description: 'User Address ID', type: String })
  @Get('/:id')
  async getDetailUserAddress(@Param('id') id: string, @Res() res: Response) {
    return this.userAddressService.getDetailUserAddress(id, res);
  }

  @ApiOperation({
    description: 'Create new user address',
  })
  @ApiBody({
    type: CreateUserAddressDto,
  })
  @Post('')
  async createUserAddress(
    @Body() dto: CreateUserAddressDto,
    @Res() res: Response,
  ) {
    return this.userAddressService.createUserAddress(dto, res);
  }

  @ApiOperation({
    description: 'Delete user address',
  })
  @ApiBody({
    type: DeleteUserAddressesDto,
  })
  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserAddress(
    @Body() dto: DeleteUserAddressesDto,
    @Res() res: Response,
  ) {
    return this.userAddressService.deleteUserAddress(dto, res);
  }

  @ApiOperation({
    description: 'Update User Address',
  })
  @ApiBody({
    type: UpdateUserAddressDto,
  })
  @ApiParam({ name: 'id', description: 'User Address ID', type: String })
  @Put('/:id')
  async updateUserAddress(
    @Param('id') id: string,
    @Body() dto: UpdateUserAddressDto,
    @Res() res: Response,
  ) {
    return await this.userAddressService.updateUserAddress(id, dto, res);
  }
}
