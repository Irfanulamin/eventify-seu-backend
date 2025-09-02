import { Request, Response } from "express";
import { ClubService } from "../services/club.services";
import { sendSuccess, sendError } from "../utils/http";

const clubService = new ClubService();

export const createClub = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, description, fbLink } = req.body;
    const file = req.file;

    if (!name || !description || !fbLink) {
      return sendError(
        res,
        "Name, description, and Facebook link are required",
        400
      );
    }

    if (!file) {
      return sendError(res, "Image is required", 400);
    }

    const club = await clubService.createClub(
      name,
      description,
      fbLink,
      file.buffer
    );
    return sendSuccess(res, "Club created successfully", club, 201);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to create club", 400);
  }
};

export const getAllClubs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const { clubs, total } = await clubService.getAllClubs(
      search as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, "Clubs retrieved successfully", {
      clubs,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || "Failed to retrieve clubs", 500);
  }
};

export const getClubById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const club = await clubService.getClubById(id);
    return sendSuccess(res, "Club retrieved successfully", club);
  } catch (error: any) {
    return sendError(res, error.message || "Club not found", 404);
  }
};

export const updateClub = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;

    const club = await clubService.updateClub(id, updates, file?.buffer);
    return sendSuccess(res, "Club updated successfully", club);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to update club", 400);
  }
};

export const deleteClub = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    await clubService.deleteClub(id);
    return sendSuccess(res, "Club deleted successfully");
  } catch (error: any) {
    return sendError(res, error.message || "Failed to delete club", 400);
  }
};
