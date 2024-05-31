import Protected from "@/utils/Protected";

export const metadata = {
  title: "Dashboard | Traffico",
  description: "Traffico",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Protected>{children}</Protected>;
}
