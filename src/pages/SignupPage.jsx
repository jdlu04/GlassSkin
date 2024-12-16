import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
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

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = auth();

  const validateForm = () => {
    if (!formData.firstName.trim()) console.log("Name is required");
    if (!formData.email.trim()) console.log("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      console.log("Invalid email format");
    if (!formData.password)
      console.log("Password is required");
    if (formData.password.length < 6)
      console.log("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      signup(formData);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google clicked");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div className="text-2xl font-bold">Glass Skin</div>
            <CardTitle className="text-2xl font-bold mt-2 pt-6">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Get started with your free account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Full Name */}
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium">
                Name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="pl-12 pr-4 py-3 border-2 border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  required
                />
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <Button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full bg-white text-black border border-gray-300 hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <img
                  src="/src/assets/icons/google.svg"
                  alt="Google Logo"
                  className="h-5 w-5"
                />
                Sign up with Google
              </Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
