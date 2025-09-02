import { Request, Response } from "express";
import { AuthService } from "../services/auth.services";
import { sendSuccess, sendError } from "../utils/http";
import { verifyToken } from "../utils/jwt";

const authService = new AuthService();

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return sendError(res, "Username, email, and password are required", 400);
    }

    const { user, token } = await authService.register(
      username,
      email,
      password
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return sendSuccess(res, "User registered successfully", userData, 201);
  } catch (error: any) {
    return sendError(res, error.message || "Registration failed", 400);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }

    const { user, token } = await authService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return sendSuccess(res, "Login successful", userData);
  } catch (error: any) {
    return sendError(res, error.message || "Login failed", 401);
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  res.clearCookie("token");
  return sendSuccess(res, "Logout successful");
};

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return sendError(res, "No token provided", 401);
    }

    const decoded = verifyToken(token);
    const user = await authService.getCurrentUser(decoded.id);

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return sendSuccess(res, "User data retrieved", userData);
  } catch (error: any) {
    return sendError(res, "Invalid token", 401);
  }
};
