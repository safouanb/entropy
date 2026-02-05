import { AppSidebar } from "@/components/layout/app-sidebar";
import { DitherTexture } from "@/components/ui/dither-texture";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-black font-satoshi">
            {/* Global Visual Effects */}
            <DitherTexture opacity={0.03} />

            {/* Sidebar */}
            <div className="flex-none z-50">
                <AppSidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-background relative selection:bg-blue-500/30">
                {/* Optional Top Header could go here */}

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto h-screen p-6 md:p-8 lg:p-12 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 slide-in-from-bottom-2">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
