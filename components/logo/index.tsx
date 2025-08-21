"use client";

import NextLink from "next/link";

import { APP_DEFAULT_PATH } from "@/config";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ to }: { to: string }) => (
  <NextLink
    href={!to ? APP_DEFAULT_PATH : to}
    passHref
    legacyBehavior
  ></NextLink>
);

export default LogoSection;
