import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session with the tokens from the email confirmation
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            // Create or update user profile
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                user_id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name || null,
                phone_number: data.user.user_metadata?.phone_number || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'user_id'
              });

            if (profileError) {
              console.error('Profile creation error:', profileError);
              // Don't throw here, as the main auth is successful
            }

            setSuccess(true);
            toast({
              title: "Email Confirmed!",
              description: "Your account has been verified successfully. Welcome to Zuptin!",
            });

            // Redirect to dashboard/home after a short delay
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 2000);
          }
        } else if (type === 'recovery') {
          // Handle password reset
          navigate("/reset-password", { replace: true });
        } else {
          // Handle other auth types or redirect to login
          navigate("/auth", { replace: true });
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'An error occurred during authentication');
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to confirm your email. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
            <CardTitle className="text-2xl">Confirming Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Email Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Your account has been verified successfully. You will be redirected to your dashboard shortly.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default AuthCallback;