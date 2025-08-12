
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    const { data, error } = await signIn(values.email, values.password);
    
    setIsLoading(false);
    
    if (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data.user) {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cre8-dark to-black  px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 z-0">
        {/* Layer 1 - Larger, more blurred */}
        <div className="absolute w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 -top-20 -left-20 animate-pulse" 
             style={{ animation: 'blob 10s infinite' }} />
        <div className="absolute w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-35 -top-10 -right-10" 
             style={{ animation: 'blob 8s infinite 2s' }} />
        
        {/* Layer 2 - Medium, sharper */}
        <div className="absolute w-80 h-80 bg-cyan-400 rounded-full mix-blend-screen filter blur-xl opacity-50 top-1/4 right-1/4" 
             style={{ animation: 'blob 12s infinite 1s' }} />
        <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-45 bottom-1/4 left-1/3" 
             style={{ animation: 'blob 9s infinite 4s' }} />
        
        {/* Layer 3 - Smaller, very sharp for definition */}
        <div className="absolute w-48 h-48 bg-emerald-400 rounded-full mix-blend-screen filter blur-lg opacity-60 top-1/2 left-1/4" 
             style={{ animation: 'blob 7s infinite 3s' }} />
        <div className="absolute w-56 h-56 bg-yellow-400 rounded-full mix-blend-screen filter blur-lg opacity-40 bottom-1/3 right-1/3" 
             style={{ animation: 'blob 11s infinite 5s' }} />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img 
              src="/lovable-uploads/logomain.png" 
              alt="CRE8HUB Logo" 
              className="h-48 mx-auto -mb-10"
            />
          </Link>
          <h2 className="mt-2 text-3xl font-bold text-white">Welcome back</h2>

        </div>
        
        <Card className="bg-white/10 rounded-xl backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-xl">Sign In</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          className="bg-cre8-dark/70 border-white/20 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-cre8-dark/70 border-white/20 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-cre8-blue focus:ring-cre8-blue border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-cre8-blue hover:text-cre8-purple">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 rounded-full bg-gradient-to-r from-cre8-blue to-cre8-purple hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/10 pt-4">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-cre8-blue hover:text-cre8-purple">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
