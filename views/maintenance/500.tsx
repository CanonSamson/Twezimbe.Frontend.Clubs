"use client";

// next
import Image from "next/legacy/image";
import NextLink from "next/link";

// project import
import { APP_DEFAULT_PATH } from "@/config";

// assets
const error500 = "/assets/images/maintenance/Error500.png";

// ==============================|| ERROR 500 - MAIN ||============================== //

function Error500() {
  return (
    <div className="flex flex-col items-center bg-slate-300 justify-center min-h-screen">
      <div>
        <div className="w-80 sm:w-96">
          <Image src={error500} alt="mantis" className="w-full h-auto" />
        </div>
        <div className="text-center">
          <h1 className={`text-${true ? "2xl" : "4xl"} font-bold`}>
            Internal Server Error
          </h1>
          <p className="text-gray-600 mt-2">
            Server error 500. we fixing the problem. please try again at a later
            stage.
          </p>
          <NextLink
            href={APP_DEFAULT_PATH}
            className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Back To Home
          </NextLink>
        </div>
      </div>
    </div>
  );
}

export default Error500;
