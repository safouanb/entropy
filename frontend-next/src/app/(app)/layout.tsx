export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <div className="flex-none">
                {/* We need to import the client component here */}
                <SidebarContainer />
            </div>
            <main className="flex-1 overflow-y-auto min-w-0">
                <div className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

import { AppSidebar } from "@/components/layout/app-sidebar";

function SidebarContainer() {
    return <AppSidebar />;
}
