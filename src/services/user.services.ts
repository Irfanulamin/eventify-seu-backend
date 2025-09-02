import User, { IUser } from "../models/user";
import { hashPassword, validatePassword } from "../utils/password";

export class UserService {
  async getAllUsers(
    search?: string,
    role?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUser[]; total: number }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return { users, total };
  }

  async updateUserRole(userId: string, role: string): Promise<IUser> {
    if (!["user", "admin", "super-admin"].includes(role)) {
      throw new Error("Invalid role");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }
  }

  async createUser(data: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<IUser> {
    const { username, email, password, role = "user" } = data;

    // Validate password
    const { isValid, message } = validatePassword(password);
    if (!isValid) {
      throw new Error(message || "Invalid password");
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash the password using your utility
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }
}
