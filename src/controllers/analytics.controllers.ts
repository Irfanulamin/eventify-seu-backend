import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.services";
import { sendSuccess, sendError } from "../utils/http";

const analyticsService = new AnalyticsService();

export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const analytics = await analyticsService.getAnalytics();
    return sendSuccess(res, "Analytics retrieved successfully", analytics);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to retrieve analytics", 500);
  }
};
