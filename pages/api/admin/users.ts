import { db } from "@/database";
import { IUser } from "@/interfaces";
import { User } from "@/models";
import { isValidObjectId } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | {
      message: string;
    }
  | IUser[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res);

    case "PUT":
      return updateUsers(req, res);

    default:
      break;
  }

  res.status(200).json({ message: "Example" });
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const users = await User.find().select("-password").lean();
  await db.disconnect();

  return res.status(200).json(users);
};
const updateUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { userID = "", role = "" } = req.body;
  if (!isValidObjectId(userID)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  const validRoles = ["client", "admin", "super-user", "SEO"];
  if (!validRoles.includes(role)) {
    return res
      .status(400)
      .json({ message: "Invalid role:" + validRoles.join(", ") });
  }

  await db.connect();

  const user = await User.findById(userID);
  if (!user) {
    await db.disconnect();
    return res.status(404).json({ message: "User not found" });
  }
  user.role = role;
  await user.save();
  await db.disconnect();

  return res.status(200).json({ message: "User updated" });
};
