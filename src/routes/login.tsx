import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedIcon } from "@/components/AnimatedIcon";

export const Route = createFileRoute("/login")({
  component: LoginScreen,
});

const isStrongPassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && hasMinLength;
};

function LoginScreen() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup States
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: "/" });
    }
  }, [user, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    if (!isStrongPassword(signupPassword)) {
      setError("A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;

      if (data.session) {
        // Logged in directly
        setMessage("Conta criada com sucesso!");
      } else {
        setMessage(
          "Conta criada com sucesso! Por favor, verifique sua caixa de entrada para confirmar o seu e-mail antes de fazer o login.",
        );
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <AnimatedIcon name="loader" className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="flex flex-row items-center justify-center text-center pb-2">
          <div className="flex justify-center">
            <img src="/logo.png" alt="Logo" className="h-40 w-40 object-contain dark:invert" />
          </div>
          <div>
            <CardTitle className="text-3xl font-serif font-bold tracking-tight text-black">
              Post Perfector
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" onClick={() => { setError(""); setMessage(""); }}>Entrar</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => { setError(""); setMessage(""); }}>Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                <Button className="w-full mt-4" type="submit" disabled={isSubmitting}>
                  {isSubmitting && <AnimatedIcon name="loader" className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    A senha deve ter no mínimo 8 caracteres, conter letra maiúscula, minúscula, número e caractere especial.
                  </p>
                </div>

                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                {message && <p className="text-sm text-green-500 font-medium">{message}</p>}

                <Button className="w-full mt-4" type="submit" disabled={isSubmitting}>
                  {isSubmitting && <AnimatedIcon name="loader" className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
