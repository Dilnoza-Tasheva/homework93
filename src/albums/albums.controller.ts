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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { CreateAlbumDto } from './create-album.dto';

@Controller()
export class AlbumsController {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}
  @Get('albums')
  async getAll() {
    return this.albumModel.find().populate('artist');
  }
  @Get('artists/:artistId/albums')
  async getByArtist(@Param('artistId') artistId: string) {
    const artist = await this.artistModel.findById(artistId);
    if (!artist) throw new NotFoundException('Artist not found');
    return this.albumModel.find({ artist: artistId }).populate('artist');
  }

  @Get('albums/:id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById(id).populate('artist');
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  @Post('albums')
  @UseInterceptors(FileInterceptor('cover', { dest: './public/images/albums' }))
  async create(
    @Body() dto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const artist = await this.artistModel.findById(dto.artist);
    if (!artist) throw new NotFoundException('Artist not found');

    const coverImage = file ? `images/albums/${file.filename}` : null;

    const created = new this.albumModel({
      artist: dto.artist,
      title: dto.title,
      releaseDate: dto.releaseDate,
      coverImage,
    });

    return created.save();
  }
  @Delete('albums/:id')
  async remove(@Param('id') id: string) {
    const res = await this.albumModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Album not found');
    return { success: true };
  }
}
