import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Settings as SettingsIcon, Shield, Database, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();

  const [showAds, setShowAds] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [defaultPlatform, setDefaultPlatform] = useState("blinkit");

  // Update local state when preferences are loaded
  useEffect(() => {
    if (preferences) {
      setShowAds(preferences.show_ads);
      setPushNotifications(preferences.push_notifications);
      setDefaultPlatform(preferences.default_platform);
    }
  }, [preferences]);

  // Handlers for updating preferences
  const handleShowAdsChange = async (checked: boolean) => {
    setShowAds(checked);
    try {
      await updatePreferences({ show_ads: checked });
      toast({
        title: "Preference Updated",
        description: "Ad preference has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preference.",
        variant: "destructive",
      });
    }
  };

  const handlePushNotificationsChange = async (checked: boolean) => {
    setPushNotifications(checked);
    try {
      await updatePreferences({ push_notifications: checked });
      toast({
        title: "Preference Updated",
        description: "Notification preference has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preference.",
        variant: "destructive",
      });
    }
  };

  const handleDefaultPlatformChange = async (platform: string) => {
    setDefaultPlatform(platform);
    try {
      await updatePreferences({ default_platform: platform });
      toast({
        title: "Preference Updated",
        description: "Default platform has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preference.",
        variant: "destructive",
      });
    }
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Please sign in</h2>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });

      setIsPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to change password.";
      toast({
        title: "Password Change Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update email in auth
      const { error: authError } = await supabase.auth.updateUser({ 
        email: newEmail 
      });
      if (authError) throw authError;

      // Update email in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ email: newEmail })
        .eq('user_id', user.id);
      
      if (profileError) throw profileError;

      toast({
        title: "Email Updated",
        description: "Your email has been updated successfully.",
      });

      setIsEmailDialogOpen(false);
      setNewEmail("");
      
      // Refresh the page to show updated email
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update email.";
      toast({
        title: "Email Update Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      if (window.confirm("This will permanently delete all your data. Are you absolutely sure?")) {
        setIsLoading(true);
        try {
          // Delete user data from all tables
          await supabase.from("user_activity").delete().eq("user_id", user.id);
          await supabase.from("platform_usage").delete().eq("user_id", user.id);
          await supabase.from("user_preferences").delete().eq("user_id", user.id);
          await supabase.from("profiles").delete().eq("user_id", user.id);
          
          // Delete user from auth (this will cascade delete due to foreign key constraints)
          const { error } = await supabase.rpc('delete_user');
          if (error) {
            // If RPC doesn't exist, try direct auth deletion (will fail but we'll handle it)
            console.warn("delete_user RPC not found, user data deleted but auth user remains");
          }

          toast({ 
            title: "Account Data Deleted", 
            description: "Your account data has been permanently deleted." 
          });
          
          // Sign out the user
          await signOut();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to delete account data.";
          toast({
            title: "Account Deletion Failed",
            description: message,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleClearCache = () => {
    const keysToRemove = [
      "recently-used-platforms",
      "app-preferences",
      "platform-history",
      "search-history",
    ];
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    toast({ title: "Cache Cleared", description: "Local cache has been cleared." });
  };

  const handleClearRecentlyUsed = () => {
    localStorage.removeItem("recently-used-platforms");
    sessionStorage.removeItem("recently-used-platforms");
    toast({ title: "Recently Used Cleared", description: "Recently used platforms have been cleared." });
  };

  const handleExportData = () => {
    const userData = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      preferences: {
        showAds,
        pushNotifications,
        defaultPlatform,
      },
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileName = `zuptin-user-data-${new Date().toISOString().split("T")[0]}.json`;

    const link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", exportFileName);
    link.click();

    toast({ title: "Data Exported", description: "Your data has been exported." });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Settings</CardTitle>
          </CardHeader>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Ads</h4>
                <p className="text-sm text-muted-foreground">Enable or disable in-app advertisements</p>
              </div>
              <Switch checked={showAds} onCheckedChange={handleShowAdsChange} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">Receive notifications for deals and updates</p>
              </div>
              <Switch checked={pushNotifications} onCheckedChange={handlePushNotificationsChange} />
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Default Platform</h4>
              <Select value={defaultPlatform} onValueChange={handleDefaultPlatformChange}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="blinkit">Blinkit</SelectItem>
                  <SelectItem value="zepto">Zepto</SelectItem>
                  <SelectItem value="instamart">Swiggy Instamart</SelectItem>
                  <SelectItem value="bigbasket">BigBasket</SelectItem>
                  <SelectItem value="swiggy">Swiggy</SelectItem>

                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Change Password Dialog */}
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">Change Password</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>New Password</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div>
                    <Label>Confirm Password</Label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <Button onClick={handleChangePassword} disabled={isLoading} className="w-full">
                    {isLoading ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Update Email Dialog */}
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">Update Email</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Update Email</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Current Email</Label>
                    <Input value={user.email || ""} disabled />
                  </div>
                  <div>
                    <Label>New Email</Label>
                    <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  </div>
                  <Button onClick={handleUpdateEmail} disabled={isLoading} className="w-full">
                    {isLoading ? "Updating..." : "Update Email"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </CardContent>
        </Card>

        {/* Data and Platform Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Platform & Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleClearRecentlyUsed}>Clear Recently Used</Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleClearCache}>Clear Cache</Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>Export Data</Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" />App Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Version</span>
              <span className="text-muted-foreground">1.0.0</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button variant="link" className="p-0 h-auto" asChild><a href="#">Privacy Policy</a></Button>
              <Button variant="link" className="p-0 h-auto" asChild><a href="#">Terms of Service</a></Button>
              <Button variant="link" className="p-0 h-auto" asChild><a href="mailto:support@zuptin.app">Contact Support</a></Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal Disclaimer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Zuptin is not affiliated with any grocery delivery platforms. We provide a unified interface to access third-party websites.</p>
              <p>All trademarks and service marks are the property of their respective owners.</p>
              <p>Use of third-party platforms is subject to their respective terms of service.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
