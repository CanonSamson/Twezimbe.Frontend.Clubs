import ProfileSettingsLayout from "@/components/settings/profile/ProfileSettingsLayout";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileSettingsLayout>{children}</ProfileSettingsLayout>
  );
}
