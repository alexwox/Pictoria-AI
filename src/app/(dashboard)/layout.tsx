import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="ml-1 mt-4" />
        <div className="flex items-center gap-2 my-4 px-4">
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
