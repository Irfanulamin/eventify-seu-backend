import { Request, Response } from "express";
import { EventService } from "../services/event.services";
import { sendSuccess, sendError } from "../utils/http";
import user from "../models/user";

const eventService = new EventService();

export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, date, club, buttons, description, createdBy } = req.body;
    const file = req.file;

    if (!name || !date || !club || !description) {
      return sendError(res, "Name, date, and club are required", 400);
    }

    if (!file) {
      return sendError(res, "Image is required", 400);
    }
    const parsedButtons = JSON.parse(req.body.buttons);

    const event = await eventService.createEvent(
      name,
      new Date(date),
      club,
      description,
      createdBy,
      file.buffer,
      parsedButtons
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

export const getEventsByCreator = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { createdBy } = req.params;
    const userInfo = await user.findById(createdBy);
    if (!userInfo) return sendError(res, "No user found", 400);
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!createdBy) {
      return sendError(res, "Creator ID is required", 400);
    }

    const { events, total } = await eventService.getEventsByCreator(
      createdBy,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, "Creator events retrieved successfully", {
      events,
      creator: createdBy,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error: any) {
    return sendError(
      res,
      error.message || "Failed to retrieve creator events",
      500
    );
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
    const updates = { ...req.body };
    const file = req.file;

    if (updates.date) {
      updates.date = new Date(updates.date);
    }

    if (updates.buttons) {
      try {
        updates.buttons = JSON.parse(updates.buttons);
      } catch {
        updates.buttons = [];
      }
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
