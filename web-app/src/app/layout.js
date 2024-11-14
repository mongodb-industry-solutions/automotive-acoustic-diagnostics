import Navbar from "@/components/navBar/Navbar";
import "./globals.css";

export const metadata = {
  title: "Automotive Acoustic Diagnostics",
  description:
    "A manufacturing and automotive demo by MongoDB Industry Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
