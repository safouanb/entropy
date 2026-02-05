"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BellIcon, KeyIcon, UserCircleIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch user settings
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            if (res.ok) {
                // Show success toast (mock for now or alert)
                alert('Settings saved successfully');
                const updated = await res.json();
                setUser(updated);
            } else {
                alert('Failed to save settings');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-white text-center py-20">Loading settings...</div>;
    }

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
                                <Input
                                    value={user?.firstName || ''}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                    className="bg-white/5 border-transparent focus:border-emerald-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Last Name</label>
                                <Input
                                    value={user?.lastName || ''}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                    className="bg-white/5 border-transparent focus:border-emerald-500/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Email Address</label>
                            <Input
                                value={user?.email || ''}
                                disabled // Email usually immutable or needs verify
                                className="bg-white/5 border-transparent focus:border-emerald-500/50 opacity-50"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
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
                            <Switch
                                checked={user?.notifyAssessmentComplete || false}
                                onCheckedChange={(c) => setUser({ ...user, notifyAssessmentComplete: c })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium text-white">Regulatory Updates</div>
                                <div className="text-sm text-muted-foreground">Alerts when compliance logic changes.</div>
                            </div>
                            <Switch
                                checked={user?.notifyRegulatoryUpdates || false}
                                onCheckedChange={(c) => setUser({ ...user, notifyRegulatoryUpdates: c })}
                            />
                        </div>
                        {/* Add save button here too or use the global one above? 
                            Typically one save button per section or global. 
                            Let's rely on the profile one or add one here. 
                            For simplicity, assume users click save on profile. 
                            Actually, better to have one save button at bottom or auto-save.
                            Let's duplicate the save button or make it global. 
                            Added Save button to Profile section. 
                            Let's add one here effectively or just tell user to save above.
                            Better: Add Save button here too.
                        */}
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleSave} disabled={saving} variant="secondary">
                                {saving ? 'Saving...' : 'Save Preferences'}
                            </Button>
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
                            <span className="flex-1 truncate">{user?.apiKeyLive || 'No API Key Generated'}</span>
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
