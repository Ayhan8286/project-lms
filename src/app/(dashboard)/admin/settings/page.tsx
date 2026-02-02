"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming we have this, else standard input type checkbox
import { Save, Settings } from "lucide-react";

const AdminSettingsPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState({
        platformName: "",
        supportEmail: "",
        maintenanceMode: false,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get("/api/admin/settings");
                const data = response.data;
                setSettings({
                    platformName: data.platformName || "",
                    supportEmail: data.supportEmail || "",
                    maintenanceMode: data.maintenanceMode === "true",
                });
            } catch {
                toast.error("Failed to load settings");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            await axios.post("/api/admin/settings", {
                values: {
                    platformName: settings.platformName,
                    supportEmail: settings.supportEmail,
                    maintenanceMode: String(settings.maintenanceMode) // Convert bool to string
                }
            });
            toast.success("Settings saved");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <div className="p-6">Loading config...</div>
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="h-6 w-6" />
                App Settings
            </h1>

            <div className="bg-white dark:bg-slate-950 border rounded-lg p-6 max-w-2xl space-y-6">

                <div className="space-y-2">
                    <label className="text-sm font-medium">Platform Name</label>
                    <Input
                        disabled={isLoading}
                        value={settings.platformName}
                        onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                        placeholder="e.g. Acme Academy"
                    />
                    <p className="text-xs text-muted-foreground">The name displayed in emails and browser titles.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Support Email</label>
                    <Input
                        disabled={isLoading}
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        placeholder="e.g. support@acme.com"
                    />
                    <p className="text-xs text-muted-foreground">Visible to students for help inquiries.</p>
                </div>

                <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <input
                        type="checkbox"
                        disabled={isLoading}
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <div className="flex flex-col">
                        <label className="text-sm font-medium">Maintenance Mode</label>
                        <p className="text-xs text-muted-foreground">If enabled, standard users will see a maintenance screen.</p>
                    </div>
                </div>

                <Button onClick={onSubmit} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                </Button>

            </div>
        </div>
    );
}

export default AdminSettingsPage;
