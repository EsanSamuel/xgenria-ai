"use client";
import axios from "axios";
import { signIn,useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthProvider from "@/components/AuthProvider";
import { redirect } from "next/navigation";

const page = () => {
  const { data: session } = useSession();
  if (session?.user) redirect("/documents");
  return (
    <div>
      <AuthProvider />
    </div>
  );
};

export default page;
