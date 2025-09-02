import mongoose, { Document, Schema } from "mongoose";

export interface IEventButton {
  label: string;
  url?: string;
}

export interface IEvent extends Document {
  name: string;
  imageUrl: string;
  imagePublicId: string;
  date: Date;
  buttons: IEventButton[];
  club: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
      maxlength: [100, "Event name cannot exceed 100 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Event image is required"],
    },
    imagePublicId: {
      type: String,
      required: [true, "Image public ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function (v: Date) {
          return v > new Date();
        },
        message: "Event date must be in the future",
      },
    },
    buttons: [
      {
        label: {
          type: String,
          required: [true, "Button label is required"],
          maxlength: [50, "Button label cannot exceed 50 characters"],
        },
        url: {
          type: String,
          validate: {
            validator: function (v: string) {
              return !v || /^https?:\/\/.+/.test(v);
            },
            message: "Please provide a valid URL",
          },
        },
      },
    ],
    club: {
      type: Schema.Types.ObjectId,
      ref: "Club",
      required: [true, "Club is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>("Event", eventSchema);
