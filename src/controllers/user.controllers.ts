import { Request, Response } from "express";
import { UserService } from "../services/user.services";
import { sendSuccess, sendError } from "../utils/http";

const userService = new UserService();

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const { users, total } = await userService.getAllUsers(
      search as string,
      role as string,
      parseInt(page as string),
      parseInt(limit as string)
    );

    return sendSuccess(res, "Users retrieved successfully", {
      users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error: any) {
    return sendError(res, error.message || "Failed to retrieve users", 500);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return sendError(res, "Role is required", 400);
    }

    const user = await userService.updateUserRole(id, role);
    return sendSuccess(res, "User role updated successfully", user);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to update user role", 400);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    return sendSuccess(res, "User deleted successfully");
  } catch (error: any) {
    return sendError(res, error.message || "Failed to delete user", 400);
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return sendError(res, "Username, email, and password are required", 400);
    }

    const user = await userService.createUser({
      username,
      email,
      password,
      role,
    });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return sendSuccess(res, "User created successfully", userData, 201);
  } catch (error: any) {
    return sendError(res, error.message || "Failed to create user", 400);
  }
};
