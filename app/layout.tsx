import type { Metadata } from "next";
import "./globals.css";
import { PromptProvider } from "@/context/PromptProvider";
import Provider from "@/components/Provider";
import Sidebar from "@/components/Sidebar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Xgenria",
  description: "Ai prompt app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster />
      <Provider>
        <PromptProvider>
          <body className="md:flex gap-2 bg-dark-2 bg-pattern bg-cover bg-center">
            <Sidebar />
            <SkeletonTheme>{children}</SkeletonTheme>
          </body>
        </PromptProvider>
      </Provider>
    </html>
  );
}
