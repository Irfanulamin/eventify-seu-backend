import User, { IUser } from "../models/user";

import { generateToken } from "../utils/jwt";
import {
  comparePassword,
  hashPassword,
  validatePassword,
} from "../utils/password";

export class AuthService {
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.message!);
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = generateToken(user);

    return { user, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    return { user, token };
  }

  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
