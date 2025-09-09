import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Check, X, Mail, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return checks;
  };

  const passwordChecks = validatePassword(password);
  const isPasswordValid = Object.values(passwordChecks).every(check => check);

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Error sending reset password email:", error.message);
        throw error;
      }

      toast({
        title: "Reset Email Sent",
        description: "Password reset link sent! Check your email.",
      });
      
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };



  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !isPasswordValid) {
      toast({
        title: "Invalid Password",
        description: "Please enter a valid password that meets all the requirements.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/auth/callback`,
            data: {
              full_name: fullName,
              phone_number: `${countryCode}${phoneNumber}`,
            },
          },
        });

        if (error) throw error;

        // Check if user is immediately confirmed (no email confirmation required)
        if (data.user && data.session) {
          toast({
            title: "Welcome to Zuptin!",
            description: "You have successfully signed up and logged in.",
          });
          navigate("/");
        } else if (data.user && !data.session) {
          // Email confirmation required
          toast({
            title: "Check Your Email!",
            description: "We've sent you a confirmation link. Please check your email and click the link to verify your account.",
          });
          // Stay on auth page to show the message
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to Zuptin! You can now start using the app.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🛒</span>
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome back" : "Create account"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin
              ? "Sign in to access all grocery platforms"
              : "Join Zuptin to start shopping"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">+91</SelectItem>
                        <SelectItem value="+1">+1</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+61">+61</SelectItem>
                        <SelectItem value="+81">+81</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required={!isLogin}
                      placeholder="Enter your phone number"
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {!isLogin && password && (
                <div className="text-sm space-y-1 mt-2">
                  <p className="text-muted-foreground font-medium">Your password must:</p>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center gap-2 ${passwordChecks.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordChecks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Be at least 8 characters long
                    </div>
                    <div className={`flex items-center gap-2 ${passwordChecks.uppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordChecks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Include at least one uppercase letter (A–Z)
                    </div>
                    <div className={`flex items-center gap-2 ${passwordChecks.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordChecks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Include at least one lowercase letter (a–z)
                    </div>
                    <div className={`flex items-center gap-2 ${passwordChecks.number ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordChecks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Include at least one number (0–9)
                    </div>
                    <div className={`flex items-center gap-2 ${passwordChecks.special ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {passwordChecks.special ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      Include at least one special character (! @ # $ % ^ & *)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading || (!isLogin && !isPasswordValid)}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Forgot Password for Sign In */}
          {isLogin && (
            <div className="mt-4 text-center">
              <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-sm text-muted-foreground hover:text-primary">
                    Forgot your password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Reset Password
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgotEmail">Email Address</Label>
                      <Input
                        id="forgotEmail"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        We'll send you a link to reset your password.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={resetLoading} className="flex-1">
                        {resetLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Send Reset Link
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}



          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;