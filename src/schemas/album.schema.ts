import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from './artist.schema';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({
    required: true,
    ref: 'Artist',
    type: mongoose.Schema.Types.ObjectId,
  })
  artist: Artist;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  releaseDate: number;

  @Prop()
  coverImage: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
