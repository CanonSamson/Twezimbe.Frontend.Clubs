import KycSettingsLayout from "@/components/settings/kyc/KycSettingsLayout";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KycSettingsLayout>{children}</KycSettingsLayout>
  );
}
