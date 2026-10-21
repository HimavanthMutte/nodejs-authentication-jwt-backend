import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

import type { Request, Response } from "express";
import { MongooseError } from "mongoose";

type SignupRequest = {
  name: string;
  email: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

export const signup = async (
  req: Request<{}, {}, SignupRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name.trim() || !email.trim() || !password) {
      res.status(400).json({
        message: "Name, email and password are required",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === 11000
    ) {
      res.status(409).json({
        message: "Email already exists",
      });
      return;
    }

    console.error(err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
