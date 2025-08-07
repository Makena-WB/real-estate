import Navbar from "@/components/navbar";
import { Providers } from "./providers";
import "./globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="p-4">
        <Providers>
          <Navbar />
          {children}
        </Providers>
        </body>
    </html>
  );
}