import {
  promptType,
  promtptProps,
  updatepromptType,
  updatepromtptProps,
} from "@/lib/zod";
import { ApiError, ApiSuccess } from "../utils/ApiResponse";
import prisma from "@/prisma/prismadb";

type Params = {
  params: {
    id: string;
  };
};

class PromptController {
  static async createPrompt(request: Request) {
    const validate = promtptProps.parse(await request.json());
    const { title, promptData, tag, user_Id }: promptType = validate;
    try {
      const promptDocument = await prisma?.prompt.create({
        data: {
          userId: user_Id,
          promptData,
          tag,
          title,
        },
      });
      return new Response(
        JSON.stringify(
          new ApiSuccess(201, "Document Created!", promptDocument)
        ),
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "Something went wrong!", [error])),
        { status: 500 }
      );
    }
  }

  static async getPrompt(request: Request, { params }: Params) {
    try {
      const userId = params.id;
      const getprompt = await prisma.prompt.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return new Response(
        JSON.stringify(new ApiSuccess(200, "Document gotten!", getprompt)),
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "Something went wrong!", [error])),
        { status: 500 }
      );
    }
  }

  static async getPromptId(request: Request, { params }: Params) {
    try {
      const getprompt = await prisma.prompt.findUnique({
        where: {
          id: params.id,
        },
        include: {
          user: true,
        },
      });
      return new Response(
        JSON.stringify(new ApiSuccess(200, "Document gotten!", getprompt)),
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "Something went wrong!", [error])),
        { status: 500 }
      );
    }
  }

  static async updatePrompt(request: Request, { params }: Params) {
    const validate = updatepromtptProps.parse(await request.json());
    const { title, promptData, tag }: updatepromptType = validate;
    try {
      const promptDocument = await prisma?.prompt.update({
        where: {
          id: params.id,
        },
        data: {
          promptData,
          tag,
          title,
        },
      });
      return new Response(
        JSON.stringify(
          new ApiSuccess(201, "Document updated!", promptDocument)
        ),
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "Something went wrong!", [error])),
        { status: 500 }
      );
    }
  }
  static async LikePrompt(request: Request, { params }: Params) {
    try {
      const { userId } = await request.json();
      const prompt = await prisma.prompt.findUnique({
        where: {
          id: params.id,
        },
      });
      let updatedLikedId = [...(prompt?.starId || [])];
      updatedLikedId.push(userId);

      const updatePrompt = await prisma.prompt.update({
        where: {
          id: params.id,
        },
        data: {
          starId: updatedLikedId,
        },
      });
      return new Response(
        JSON.stringify(new ApiSuccess(201, "Document Liked!", updatePrompt)),
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "Something went wrong!", [error])),
        { status: 500 }
      );
    }
  }
  static async unLikePrompt(request: Request, { params }: Params) {
    try {
      const prompt = await prisma.prompt.findUnique({
        where: {
          id: params.id,
        },
      });

      let updatedLikedId = [...(prompt?.starId || [])];
      updatedLikedId = [];

      const unLike = await prisma.prompt.update({
        where: {
          id: params.id,
        },
        data: {
          starId: updatedLikedId,
        },
      });
      return new Response(
        JSON.stringify(new ApiSuccess(200, "Document unLiked!", unLike)),
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify(new ApiError(500, "Something went wrong!", [error])),
        { status: 500 }
      );
    }
  }
}

export default PromptController;
