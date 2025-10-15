import { Album } from './album.schema';
import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from './artist.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({
    required: true,
    ref: 'Album',
    type: mongoose.Schema.Types.ObjectId,
  })
  album: Album;

  @Prop({ required: true })
  title: string;

  @Prop()
  length: string;

  @Prop({
    required: true,
    ref: 'Artist',
    type: mongoose.Schema.Types.ObjectId,
  })
  artist: Artist;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
