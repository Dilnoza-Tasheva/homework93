import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { CreateTrackDto } from './create-track.dto';

@Controller()
export class TracksController {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}

  @Get('tracks')
  async getAll() {
    return this.trackModel.find().populate('album').populate('artist');
  }

  @Get('albums/:albumId/tracks')
  async getByAlbum(@Param('albumId') albumId: string) {
    const album = await this.albumModel.findById(albumId);
    if (!album) throw new NotFoundException('Album not found');
    return this.trackModel
      .find({ album: albumId })
      .populate('artist')
      .populate('album');
  }

  @Post('tracks')
  async create(@Body() dto: CreateTrackDto) {
    const album = await this.albumModel.findById(dto.album);
    if (!album) throw new NotFoundException('Album not found');

    const artist = await this.artistModel.findById(dto.artist);
    if (!artist) throw new NotFoundException('Artist not found');

    const created = new this.trackModel({
      album: dto.album,
      title: dto.title,
      length: dto.length,
      artist: dto.artist,
    });

    return created.save();
  }

  @Delete('tracks/:id')
  async remove(@Param('id') id: string) {
    const res = await this.trackModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Track not found');
    return { success: true };
  }
}
