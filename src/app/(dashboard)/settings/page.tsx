import { UserProfile } from "@clerk/nextjs";

const SettingsPage = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 w-full">
            <div className="w-full max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account profile and security.</p>
                </div>
                <div className="flex justify-center w-full">
                    <UserProfile
                        appearance={{
                            elements: {
                                rootBox: "w-full shadow-none",
                                card: "shadow-sm border border-slate-200 dark:border-slate-800 w-full"
                            }
                        }}
                        routing="hash"
                    />
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
