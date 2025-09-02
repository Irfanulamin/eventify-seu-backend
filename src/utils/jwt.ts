import jwt from "jsonwebtoken";
import { IUser } from "../models/user";

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as any,
    { expiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as any }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
