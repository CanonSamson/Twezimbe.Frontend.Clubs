import localFont from "next/font/local";
import "./globals.css";
import { ResolvingMetadata } from "next";
import { Toaster } from "@/components/ui/sonner";
// PROJECT IMPORTS
import ProviderWrapper from "../contexts/ProviderWrapper";

const inter = localFont({
  src: "../public/assets/fonts/Inter-Font.ttf",
  variable: "--font-inter",
});
const roboto = localFont({
  src: "../public/assets/fonts/Roboto-Regular.ttf",
  variable: "--font-roboto",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({}: Props, parent: ResolvingMetadata) {
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  // generate metadata
  const metadata = {
    title: "Twezi",
    description: "Connect and Grow",
    openGraph: {
      title: "Twezi",
      description: "Connect and Grow",
      images: [
        `${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/images/meta-image.png`,
        ...previousImages,
      ].filter(Boolean),
    },
  };

  return metadata;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={` ${roboto.variable} ${inter.variable} h-[100dvh] overflow-hidden tablet-lg:-z-10  tablet-lg:relative  tablet-lg:left-0 tablet-lg:right-0 tablet-lg:top-0 tablet-lg:bottom-0 flex flex-row`}
      >
        <ProviderWrapper>{children}</ProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}
