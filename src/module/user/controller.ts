import { Request, Response } from "express";
import { User } from "./model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../commons/middleware/errors";

class AuthController {
  register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // ✅ Set token in cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access from client-side JS
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      status: true,
      message: "Registration successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password)
      throw new BadRequestException("Email and password required");

    const user = await User.findOne({ email });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // ✅ Set token in cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access from client-side JS
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      status: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  };

  logout = (req: Request, res: Response) => {
    res.clearCookie("token", { path: "/" });
    res.json({ status: true, message: "Logged out successfully" });
  };

  me = async (req: Request, res: Response) => {
    const user = await User.findById(req.user?.id).select("-password");
    res.json({ status: true, data: user });
  };

  updateProfile = async (req: Request, res: Response) => {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { name, phone, avatar },
      { new: true }
    );
    res.json({ status: true, data: user, message: "Profile Updated" });
  };

  changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  };
}

export default new AuthController();
