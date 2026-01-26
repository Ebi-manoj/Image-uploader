import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const imageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

imageSchema.index({ userId: 1, order: 1 });

export type ImageDocument = mongoose.HydratedDocument<
  InferSchemaType<typeof imageSchema>
>;

export const ImageModel = mongoose.model('Image', imageSchema);
