import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

const DashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full min-h-screen bg-gray-50 dark:bg-slate-950">
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-56 pt-[80px] h-full">
                <div className="fixed top-0 right-0 left-0 md:left-56 h-[80px] z-40 bg-background/60 backdrop-blur-md">
                    <Navbar />
                </div>
                <div className="p-6 h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
