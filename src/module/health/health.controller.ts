import { Controller, Get, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Health check')
@ApiBearerAuth()
@Controller('health')
export class HealthController {
  @ApiOperation({
    description: 'Check health of sever',
  })
  @Get()
  async getHealthCheck(@Res() res: Response) {
    return res.status(200).json({
      message: 'Hello world! The Fake Shop base Service is still alive!',
    });
  }
}
