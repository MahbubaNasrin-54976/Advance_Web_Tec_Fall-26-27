import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, basename, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { CourseService } from './course.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';

const uploadDirectory = join(process.cwd(), 'src', 'uploads');

function ensureUploadDirectory() {
  if (!existsSync(uploadDirectory)) {
    mkdirSync(uploadDirectory, { recursive: true });
  }
}

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Post()
  createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  @Put(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, dto);
  }

  @Patch(':id')
  patchCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.courseService.patchCourse(id, dto);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          ensureUploadDirectory();
          callback(null, uploadDirectory);
        },

        filename: (_req, file, callback) => {
          const uniqueName = `${Date.now()}-${basename(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),

      limits: {
        fileSize: 2 * 1024 * 1024,
      },

      fileFilter: (_req, file, callback) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
        const extension = extname(file.originalname).toLowerCase();

        if (!allowedExtensions.includes(extension)) {
          return callback(
            new BadRequestException(
              'Only .jpg, .jpeg, .png and .pdf files are allowed',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  uploadCourseMaterial(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.courseService.uploadCourseMaterial(id, file);
  }
}