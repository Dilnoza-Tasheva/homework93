import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create-artist.dto';
import { Model } from 'mongoose';

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
  async remove(@Param('id') id: string) {
    const res = await this.artistModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Artist not found');
    return { success: true };
  }
}
