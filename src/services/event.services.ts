import Event, { IEvent, IEventButton } from "../models/event";
import Club from "../models/club";
import { uploadToCloudinary, deleteFromCloudinary } from "./upload.services";

export class EventService {
  async createEvent(
    name: string,
    date: Date,
    club: string,
    description: string,
    createdBy: string,
    imageBuffer: Buffer,
    buttons?: IEventButton
  ): Promise<IEvent> {
    const clubInfo = await Club.findById(club);
    if (!clubInfo) {
      throw new Error("Club not found");
    }

    const { url: imageUrl, publicId: imagePublicId } = await uploadToCloudinary(
      imageBuffer,
      "events"
    );

    const event = await Event.create({
      name,
      imageUrl,
      imagePublicId,
      date,
      buttons: buttons || [],
      club,
      createdBy,
      description,
    });

    const createdEvent = await Event.findById(event._id).populate(
      "club createdBy",
      "-password"
    );
    if (!createdEvent) {
      throw new Error("Event not found after creation");
    }
    return createdEvent;
  }

  async getAllEvents(
    clubId?: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 10
  ): Promise<{ events: IEvent[]; total: number }> {
    const query: any = {};

    if (clubId) {
      query.club = clubId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate("club createdBy", "-password")
        .skip(skip)
        .limit(limit)
        .sort({ date: 1 }),
      Event.countDocuments(query),
    ]);

    return { events, total };
  }

  async getEventsByCreator(
    createdBy: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 1,
    limit: number = 10
  ): Promise<{ events: IEvent[]; total: number }> {
    const query: any = {
      createdBy: createdBy,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate("club createdBy", "-password")
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 }), // Latest events first
      Event.countDocuments(query),
    ]);

    return { events, total };
  }

  async getEventById(eventId: string): Promise<IEvent> {
    const event = await Event.findById(eventId).populate(
      "club createdBy",
      "-password"
    );

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  async updateEvent(
    eventId: string,
    updates: Partial<IEvent>,
    imageBuffer?: Buffer
  ): Promise<IEvent> {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    if (updates.club) {
      const club = await Club.findById(updates.club);
      if (!club) {
        throw new Error("Club not found");
      }
    }

    if (imageBuffer) {
      await deleteFromCloudinary(event.imagePublicId);
      const { url: imageUrl, publicId: imagePublicId } =
        await uploadToCloudinary(imageBuffer, "events");
      updates.imageUrl = imageUrl;
      updates.imagePublicId = imagePublicId;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true,
    }).populate("club createdBy", "-password");

    return updatedEvent!;
  }

  async deleteEvent(eventId: string): Promise<void> {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    await deleteFromCloudinary(event.imagePublicId);
    await Event.findByIdAndDelete(eventId);
  }
}
