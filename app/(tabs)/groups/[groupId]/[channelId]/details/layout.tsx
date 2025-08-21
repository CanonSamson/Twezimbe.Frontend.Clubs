import LayoutHeader from "@/components/chatview/LayoutHeader";


export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutHeader>{children}</LayoutHeader>
  );
}
