import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsDecorator } from '../../common/decorators/permissions.decorator';
import { PaginationParamsDto } from '../../common/dto/pagination-params.dto';
import { multerConfig } from './multer.config';
import * as path from 'path';
import { Response } from 'express';
import * as fs from 'fs';

import { ApiTags } from '@nestjs/swagger';
// ...existing code...
@ApiTags('files')
@Controller('files')
@UseGuards(PermissionsGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @PermissionsDecorator('files.upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateFileDto,
  ) {
    const fileDto: CreateFileDto = {
      ...body,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
    };
    try {
      return await this.filesService.create(fileDto);
    } catch (error) {
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('files.read')
  findAll(@Query() pagination: PaginationParamsDto) {
    return this.filesService.findAll(pagination);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('files.read')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Get('download/:filename')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('files.download')
  async downloadFile(@Query('id') id: string, @Res() res: Response) {
    let file;
    file = await this.filesService.findOne(id);
    if (!file) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    const filePath = path.resolve(file.path);
    const fileStream = await this.filesService.getFileStream(filePath);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.originalName}"`,
    );
    fileStream.pipe(res);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('files.delete')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
