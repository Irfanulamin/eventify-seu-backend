import mongoose, { Document, Schema } from "mongoose";

export interface IClub extends Document {
  name: string;
  imageUrl: string;
  imagePublicId: string;
  description: string;
  fbLink: string;
  createdAt: Date;
  updatedAt: Date;
}

const clubSchema = new Schema<IClub>(
  {
    name: {
      type: String,
      required: [true, "Club name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Club name cannot exceed 100 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Club image is required"],
    },
    imagePublicId: {
      type: String,
      required: [true, "Image public ID is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    fbLink: {
      type: String,
      required: [true, "Facebook link is required"],
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/(www\.)?facebook\.com\/.+/.test(v);
        },
        message: "Please provide a valid Facebook URL",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IClub>("Club", clubSchema);
