"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BellIcon, KeyIcon, UserCircleIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account and platform preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Section */}
                <Card className="glass-card border-white/5">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-emerald-400">
                                <UserCircleIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your public profile and contact details.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/50 uppercase tracking-widest">First Name</label>
                                <Input defaultValue="Demo" className="bg-white/5 border-transparent focus:border-emerald-500/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Last Name</label>
                                <Input defaultValue="User" className="bg-white/5 border-transparent focus:border-emerald-500/50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Email Address</label>
                            <Input defaultValue="user@entropy.energy" className="bg-white/5 border-transparent focus:border-emerald-500/50" />
                        </div>
                        <div className="flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="glass-card border-white/5">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-amber-400">
                                <BellIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Notifications</CardTitle>
                                <CardDescription>Configure how you receive alerts and reports.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium text-white">Assessment Complete</div>
                                <div className="text-sm text-muted-foreground">Receive an email when a decision record is finalized.</div>
                            </div>
                            <Switch checked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium text-white">Regulatory Updates</div>
                                <div className="text-sm text-muted-foreground">Alerts when compliance logic changes.</div>
                            </div>
                            <Switch checked />
                        </div>
                    </CardContent>
                </Card>

                {/* API Keys */}
                <Card className="glass-card border-white/5">
                    <CardHeader className="pb-4 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 text-purple-400">
                                <KeyIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>API Keys</CardTitle>
                                <CardDescription>Manage keys for external integrations.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-sm text-white/70">
                            <span className="flex-1 truncate">sk_live_51M...8q3</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">Copy</Button>
                        </div>
                        <Button variant="outline" className="w-full mt-4 border-dashed border-white/20 hover:border-emerald-500/50 hover:text-emerald-400">
                            Generate New Key
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
