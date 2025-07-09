import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Kelaa LAC Inventory",
  description: "Inventory Management App for Kelaa Local Authority Company",
  icons: {
    icon: "/favicon.png", // Make sure this file exists in /public
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
