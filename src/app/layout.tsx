import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen font-albert">
          <aside className="w-64 bg-white bg-opacity-5 p-4 text-white">
            <h1 className="mb-4 text-xl font-bold">Sidebar</h1>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="block rounded p-2 hover:bg-gray-700"
                  >
                    Chat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hives"
                    className="block rounded p-2 hover:bg-gray-700"
                  >
                    Manage Hives
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="block rounded p-2 hover:bg-gray-700"
                  >
                    Manage Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
