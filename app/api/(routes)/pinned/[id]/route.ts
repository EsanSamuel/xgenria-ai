import PromptController from "@/app/api/controller/prompt.controller";

export const POST = PromptController.pinnDocument;
export const GET = PromptController.getPinnedDocument;
export const DELETE = PromptController.deletePinned;
