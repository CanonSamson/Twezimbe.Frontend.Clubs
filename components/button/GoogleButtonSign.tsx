import Link from "next/link";

export const dynamic = 'force-dynamic' // Ensure this page is always server-rendered

function GoogleButtonSign({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link
        onClick={async () => {}}
        href={`${process.env.NEXT_PUBLIC_API_URL}/v1/tenancy/auth/google`}
      >
        {children}
      </Link>
    </>
  );
}

export default GoogleButtonSign;
