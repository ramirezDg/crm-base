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
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { PermissionsDecorator } from '../common/decorators';
import { PaginationParamsDto } from '../common/dto/pagination-params.dto';
import { multerConfig } from './multer.config';

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
    return await this.filesService.create(fileDto);
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

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @PermissionsDecorator('files.delete')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
