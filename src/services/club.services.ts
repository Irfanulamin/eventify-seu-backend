import Club, { IClub } from "../models/club";
import { uploadToCloudinary, deleteFromCloudinary } from "./upload.services";

export class ClubService {
  async createClub(
    name: string,
    description: string,
    fbLink: string,
    imageBuffer: Buffer
  ): Promise<IClub> {
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      throw new Error("Club with this name already exists");
    }

    const { url: imageUrl, publicId: imagePublicId } = await uploadToCloudinary(
      imageBuffer,
      "clubs"
    );

    const club = await Club.create({
      name,
      imageUrl,
      imagePublicId,
      description,
      fbLink,
    });

    return club;
  }

  async getAllClubs(
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ clubs: IClub[]; total: number }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [clubs, total] = await Promise.all([
      Club.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Club.countDocuments(query),
    ]);

    return { clubs, total };
  }

  async getClubById(clubId: string): Promise<IClub> {
    const club = await Club.findById(clubId);

    if (!club) {
      throw new Error("Club not found");
    }

    return club;
  }

  async updateClub(
    clubId: string,
    updates: Partial<IClub>,
    imageBuffer?: Buffer
  ): Promise<IClub> {
    const club = await Club.findById(clubId);

    if (!club) {
      throw new Error("Club not found");
    }

    const allowedUpdates: Partial<IClub> = {};

    if (updates.name !== undefined && updates.name !== club.name) {
      const existingClub = await Club.findOne({ name: updates.name });
      if (existingClub) {
        throw new Error("Club with this name already exists");
      }
      allowedUpdates.name = updates.name;
    }

    if (
      updates.description !== undefined &&
      updates.description !== club.description
    ) {
      allowedUpdates.description = updates.description;
    }
    if (updates.fbLink !== undefined && updates.fbLink !== club.fbLink) {
      allowedUpdates.fbLink = updates.fbLink;
    }

    if (imageBuffer) {
      await deleteFromCloudinary(club.imagePublicId);
      const { url: imageUrl, publicId: imagePublicId } =
        await uploadToCloudinary(imageBuffer, "clubs");
      allowedUpdates.imageUrl = imageUrl;
      allowedUpdates.imagePublicId = imagePublicId;
    }

    const updatedClub = await Club.findByIdAndUpdate(clubId, allowedUpdates, {
      new: true,
      runValidators: true,
    });

    return updatedClub!;
  }

  async deleteClub(clubId: string): Promise<void> {
    const club = await Club.findById(clubId);

    if (!club) {
      throw new Error("Club not found");
    }

    await deleteFromCloudinary(club.imagePublicId);
    await Club.findByIdAndDelete(clubId);
  }
}
