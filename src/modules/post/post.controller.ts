import {
  BadGatewayException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { User } from 'src/entities/user.entity';
import { CurrentUser } from '../auth/decor/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() query: any) {
    return this.postService.findAll(query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }

  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(slug, updatePostDto);
  }

  @Post('upload-photo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/posts',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const nameExtension = file.originalname.split('.')[1];
          const newName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + nameExtension;
          cb(null, newName);
        },
      }),
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadGatewayException('file is not an image');
    } else {
      return {
        filePatch: `http://localhost:5400/post/photos/${file.filename}`,
      };
    }
  }

  @Get('photos/:filename')
  getPhoto(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, { root: './photos/posts' });
  }
}
