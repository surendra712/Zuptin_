import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  const { toast } = useToast();
  
  // App Preferences
  const [showAds, setShowAds] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [defaultPlatform, setDefaultPlatform] = useState("blinkit");

  // Account Settings State
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [updateEmailOpen, setUpdateEmailOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      setChangePasswordOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      toast({
        title: "Email Update Requested",
        description: "Please check your new email for confirmation.",
      });
      setUpdateEmailOpen(false);
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Email Update Failed",
        description: error.message || "Failed to update email.",
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
          // First delete the profile
          await supabase
            .from('profiles')
            .delete()
            .eq('user_id', user.id);

          // Then delete the user account
          const { error } = await supabase.auth.admin.deleteUser(user.id);
          
          if (error) throw error;

          toast({
            title: "Account Deleted",
            description: "Your account has been permanently deleted.",
          });
          
          // Sign out and redirect
          await signOut();
        } catch (error: any) {
          toast({
            title: "Account Deletion Failed",
            description: error.message || "Failed to delete account. Please contact support.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleClearCache = () => {
    // Clear all local storage items related to the app
    const keysToRemove = [
      'recently-used-platforms',
      'app-preferences',
      'platform-history',
      'search-history'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    toast({
      title: "Cache Cleared",
      description: "Local cache has been cleared successfully.",
    });
  };

  const handleClearRecentlyUsed = () => {
    localStorage.removeItem('recently-used-platforms');
    sessionStorage.removeItem('recently-used-platforms');
    
    toast({
      title: "Recently Used Cleared",
      description: "Recently used platforms have been cleared.",
    });
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
        defaultPlatform
      },
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `zuptin-user-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
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
                  <Switch checked={showAds} onCheckedChange={setShowAds} />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications for deals and updates</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Default Platform</h4>
                  <p className="text-sm text-muted-foreground">Choose your preferred grocery platform</p>
                  <Select value={defaultPlatform} onValueChange={setDefaultPlatform}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blinkit">Blinkit</SelectItem>
                      <SelectItem value="zepto">Zepto</SelectItem>
                      <SelectItem value="instamart">Swiggy Instamart</SelectItem>
                      <SelectItem value="bigbasket">BigBasket</SelectItem>
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
                <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button 
                        onClick={handleChangePassword} 
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Changing..." : "Change Password"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={updateEmailOpen} onOpenChange={setUpdateEmailOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      Update Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Email</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentEmail">Current Email</Label>
                        <Input
                          id="currentEmail"
                          value={user.email || ""}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newEmailInput">New Email</Label>
                        <Input
                          id="newEmailInput"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter new email address"
                        />
                      </div>
                      <Button 
                        onClick={handleUpdateEmail} 
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Updating..." : "Update Email"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete Account"}
                </Button>
              </CardContent>
            </Card>

            {/* Platform Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Platform Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleClearRecentlyUsed}
                >
                  Clear Recently Used
                </Button>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleClearCache}
                >
                  Clear Cache
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleExportData}
                >
                  Export Data
                </Button>
              </CardContent>
            </Card>

            {/* App Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  App Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Version</span>
                  <span className="text-muted-foreground">1.0.0</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </Button>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>
                  </Button>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a href="mailto:support@zuptin.app" target="_blank" rel="noopener noreferrer">
                      Contact Support
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Legal Disclaimers */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    Zuptin is not affiliated with any grocery delivery platforms. We provide a unified interface to access third-party websites.
                  </p>
                  <p>
                    All trademarks and service marks are the property of their respective owners.
                  </p>
                  <p>
                    Use of third-party platforms is subject to their respective terms of service.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;