import { NextResponse } from 'next/server';
import Cookies from "js-cookie";

export async function GET() {
  const isLoggedIn = Cookies.get("access-token");

  if (isLoggedIn) {
    return NextResponse.json({ protected: true });
  } else {
    return NextResponse.json({ protected: false });
  }
}
