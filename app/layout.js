import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/Providers.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nobi | Your Links Deserve Better.",
  description:
    "An online links folder where users can organize, share, and manage their links easily.",
};

export default function RootLayout({ children }) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <div
            style={{
              background: "#101010",
              color: "#16171c",
            }}
          >
            <ToastContainer
              hideProgressBar={false}
              position="top-center"
              autoClose={3000}
              limit={2}
            />
          </div>
          {children}
        </body>
      </html>
    </Providers>
  );
}
