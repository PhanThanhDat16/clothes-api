import { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    fullName: string;
  };
}

export const googleCallback = (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.URL_CLIENT}/login`);
    }

    if (!process.env.SECRET_KEY_ACCESSTOKEN) {
      throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      process.env.SECRET_KEY_ACCESSTOKEN,
      { expiresIn: "1d" }
    );

    // Redirect về frontend + kèm token
    res.redirect(`${process.env.URL_CLIENT}/auth/success?token=${accessToken}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.URL_CLIENT}/login`);
  }
};
