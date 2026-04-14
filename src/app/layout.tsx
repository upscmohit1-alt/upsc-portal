import type { Metadata } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
});

export const metadata: Metadata = {
  title: "Crash Course Civil Services",
  description: "UPSC Notes, Current Affairs and MCQ Practice",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var useDark = saved ? saved === 'dark' : prefersDark;
                  document.documentElement.classList.toggle('dark', useDark);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${lora.variable} ${sourceSans3.variable} font-sans antialiased transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
