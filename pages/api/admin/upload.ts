import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import fs from "fs";

import { v2 as clodinary } from "cloudinary";

clodinary.config(process.env.CLOUDINARY_URL || "");

type Data = {
  message: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return uploadFile(req, res);
    default:
      res.status(400).json({ message: "Method not allowed" });
  }
}

const saveFile = async (file: File): Promise<string> => {
  /*  
    //Grabar como local (No usar)
 const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public/${file.originalFilename}`, data);
  fs.unlinkSync(file.filepath);
  return `./public/${file.originalFilename}`; */

  const { secure_url } = await clodinary.uploader.upload(file.filepath);
  return secure_url;
};

const parseFiles = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      if (!files.file) {
        return reject("File not found");
      }
      const filePath = await saveFile(files.file[0] as File);
      resolve(filePath);
    });
  });
};

const uploadFile = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const url = await parseFiles(req);

  return res.status(200).json({ message: url });
};
