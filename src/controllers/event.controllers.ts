import { Request, Response } from "express";
import { EventService } from "../services/event.services";
import { sendSuccess, sendError } from "../utils/http";

const eventService = new EventService();

export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, date, club, buttons, description } = req.body;
    const file = req.file;
    const createdBy = (req as any).user._id;

    if (!name || !date || !club || !description) {
      return sendError(res, "Name, date, and club are required", 400);
    }

    if (!file) {
      return sendError(res, "Image is required", 400);
    }

    const event = await eventService.createEvent(
      name,
      new Date(date),
      club,
      createdBy,
      description,
      file.buffer,
      buttons
    );

    return sendSuccess(res, "Event created successfully", event, 201);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to create event", 400);
  }
};

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { club, startDate, endDate, page = 1, limit = 10 } = req.query;

    const { events, total } = await eventService.getAllEvents(
      club as string,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, "Events retrieved successfully", {
      events,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || "Failed to retrieve events", 500);
  }
};

export const getEventById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    return sendSuccess(res, "Event retrieved successfully", event);
  } catch (error: any) {
    return sendError(res, error.message || "Event not found", 404);
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;

    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    const event = await eventService.updateEvent(id, updates, file?.buffer);
    return sendSuccess(res, "Event updated successfully", event);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to update event", 400);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    await eventService.deleteEvent(id);
    return sendSuccess(res, "Event deleted successfully");
  } catch (error: any) {
    return sendError(res, error.message || "Failed to delete event", 400);
  }
};
