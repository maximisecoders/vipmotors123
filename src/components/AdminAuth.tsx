import { useState } from 'react';
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';
import { AtSign, KeyRound, User } from 'lucide-react';

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) throw error;

      if (data?.user) {
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Please check your email for verification link",
        });
        setIsLogin(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign up",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;

      toast({
        title: "Success",
        description: "Password reset instructions sent to your email",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset instructions",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-50 px-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Admin Login" : "Admin Sign Up"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin 
              ? "Please sign in to access the admin dashboard"
              : "Create your admin account"
            }
          </p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-luxury-600 hover:bg-luxury-700"
            disabled={loading}
          >
            {loading 
              ? (isLogin ? "Signing in..." : "Signing up...") 
              : (isLogin ? "Sign In" : "Sign Up")
            }
          </Button>
        </form>

        <div className="space-y-4 text-center">
          <Button
            variant="link"
            className="text-sm text-luxury-600 hover:text-luxury-700"
            onClick={handleResetPassword}
          >
            Forgot password?
          </Button>

          <div className="text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              variant="link"
              className="text-luxury-600 hover:text-luxury-700 font-semibold"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminAuth;
