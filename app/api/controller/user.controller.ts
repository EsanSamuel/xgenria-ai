import prisma from "@/prisma/prismadb";
import { ApiSuccess, ApiError } from "../utils/ApiResponse";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";

type Params = {
  params: {
    id: string;
  };
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class UserController {
  static async createUser(request: Request, { params }: Params) {
    try {
      const { username, email, password } = await request.json();
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      return new Response(
        JSON.stringify(new ApiSuccess(201, "user gotten!", user)),
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "error fetching user!!", [error])),
        { status: 500 }
      );
    }
  }

  static async getUser(request: Request, { params }: Params) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: params.id,
        },
      });

      return new Response(
        JSON.stringify(new ApiSuccess(200, "user gotten!", user)),
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "error fetching user!!", [error])),
        { status: 500 }
      );
    }
  }

  static async editUser(request: Request, { params }: Params) {
    try {
      const { username, image } = await request.json();
      const imageUrl = await cloudinary.uploader.upload(image);
      const user = await prisma.user.update({
        where: {
          id: params.id,
        },
        data: {
          username,
          image: imageUrl.url,
        },
      });

      return new Response(
        JSON.stringify(new ApiSuccess(200, "user edited!", user)),
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "error fetching user!!", [error])),
        { status: 500 }
      );
    }
  }
}

export default UserController;
