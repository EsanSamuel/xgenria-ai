"use client";
import runChat from "@/config/gemini";
import React from "react";

export type PromptType = {
  input: string;
  setInput: any;
  sendPrompt: (prompt?: string) => void;
  promptData: any;
  isLoading: boolean;
};

export const PromptContext = React.createContext<PromptType | null>(null);

export const PromptProvider = ({ children }: { children: React.ReactNode }) => {
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
        promptArray += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse = promptArray!.split("*").join("</br>");
    setPromptData(newResponse as string);
  };
  return (
    <PromptContext.Provider
      value={{ input, setInput, sendPrompt, promptData, isLoading }}
    >
      {children}
    </PromptContext.Provider>
  );
};
