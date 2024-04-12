import prisma from "@/prisma/prismadb";
import { ApiSuccess, ApiError } from "../utils/ApiResponse";
import { v2 as cloudinary } from "cloudinary";

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
