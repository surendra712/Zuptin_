import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Settings as SettingsIcon, Shield, Database, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // App Preferences
  const [showAds, setShowAds] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [defaultPlatform, setDefaultPlatform] = useState("blinkit");

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

  const handleClearCache = () => {
    localStorage.removeItem('recently-used-platforms');
    toast({
      title: "Cache Cleared",
      description: "Local cache has been cleared successfully.",
    });
  };

  const handleClearRecentlyUsed = () => {
    localStorage.removeItem('recently-used-platforms');
    toast({
      title: "Recently Used Cleared",
      description: "Recently used platforms have been cleared.",
    });
  };

  const handleExportData = () => {
    const userData = {
      email: user.email,
      created_at: user.created_at,
      preferences: {
        showAds,
        pushNotifications,
        defaultPlatform
      }
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'zuptin-user-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      if (window.confirm("This will permanently delete all your data. Are you absolutely sure?")) {
        // In a real app, this would call the deletion API
        toast({
          title: "Account Deletion",
          description: "Account deletion is not implemented in this demo.",
          variant: "destructive",
        });
      }
    }
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
                      <SelectItem value="dunzo">Dunzo</SelectItem>
                      <SelectItem value="jiomart">JioMart</SelectItem>
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
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Update Email
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start" 
                  onClick={handleDeleteAccount}
                >
                  Delete Account
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