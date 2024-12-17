import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { auth } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = auth();
  const { signIn, isLoaded } = useSignIn();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/", 
      });
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#c0c78cb3]">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div>Glass Skin</div>
            <CardTitle className="text-2xl font-bold mt-2 pt-6">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-12 pr-10 py-3 border-2 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <img
                  src="src/assets/icons/google.svg"
                  alt="Google Logo"
                  className="h-5 w-5"
                />
                Sign in with Google
              </Button>
            </div>
          </form>

          <div className="text-center mt-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
