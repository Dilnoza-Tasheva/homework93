import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserDocument = User & Document & UserMethods;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  token: string;

  @Prop()
  displayName: string;

  @Prop({ required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
