import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create-artist.dto';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artist = await this.artistModel.findById(id);
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  @Post()
  @UseGuards(TokenAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/images/artists' }),
  )
  async create(
    @Body() dto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const image = file ? `images/artists/${file.filename}` : null;

    const created = new this.artistModel({
      name: dto.name,
      information: dto.information,
      image,
    });

    return created.save();
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, RoleGuard('admin'))
  async remove(@Param('id') id: string) {
    const res = await this.artistModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Artist not found');
    return { success: true };
  }
}
