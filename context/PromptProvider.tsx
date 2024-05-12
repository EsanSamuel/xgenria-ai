"use client";
import runChat from "@/config/gemini";
import React from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export type PromptType = {
  input: string;
  setInput: any;
  sendPrompt: (prompt?: string) => void;
  promptData: any;
  isLoading: boolean;
};

export const PromptContext = React.createContext<PromptType | null>(null);

export const PromptProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [input, setInput] = React.useState<string>("");
  const [promptData, setPromptData] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const sendPrompt = async () => {
    setIsLoading(true);
    setPromptData("");
    const response = await runChat(input);
    setIsLoading(false);
    let responseArray = response.split("**");
    let promptArray: string = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        promptArray += responseArray[i];
      } else {
        promptArray += responseArray[i];
      }
    }
    let newResponse = promptArray!;
    setPromptData(newResponse as string);

    try {
      const Recentresponse = await axios.post("/api/recent", {
        user_Id: session?.user?.id,
        recent: input,
        prompt: newResponse,
      });
      console.log(Recentresponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <PromptContext.Provider
      value={{ input, setInput, sendPrompt, promptData, isLoading }}
    >
      {children}
    </PromptContext.Provider>
  );
};
