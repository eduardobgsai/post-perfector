import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-C2y_zUVs.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as AnimatedIcon } from "./AnimatedIcon-Cib4KO2e.mjs";
import { n as useAuth } from "./AuthContext-DCdjol5D.mjs";
import { a as CardHeader, n as Card, o as CardTitle, r as CardContent, s as Input, t as Button } from "./button-CRcvUyLi.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Vln9BE63.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var isStrongPassword = (password) => {
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
	const [loginEmail, setLoginEmail] = (0, import_react.useState)("");
	const [loginPassword, setLoginPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [signupEmail, setSignupEmail] = (0, import_react.useState)("");
	const [signupPassword, setSignupPassword] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!isLoading && user) navigate({ to: "/" });
	}, [
		user,
		isLoading,
		navigate
	]);
	const handleLogin = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");
		setMessage("");
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: loginEmail,
				password: loginPassword
			});
			if (error) throw error;
		} catch (err) {
			setError(err.message || "Erro ao fazer login");
		} finally {
			setIsSubmitting(false);
		}
	};
	const handleSignup = async (e) => {
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
				options: { data: { full_name: name } }
			});
			if (error) throw error;
			if (data.session) setMessage("Conta criada com sucesso!");
			else setMessage("Conta criada com sucesso! Por favor, verifique sua caixa de entrada para confirmar o seu e-mail antes de fazer o login.");
		} catch (err) {
			setError(err.message || "Erro ao criar conta");
		} finally {
			setIsSubmitting(false);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedIcon, {
			name: "loader",
			className: "mr-2 h-4 w-4 animate-spin"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-md shadow-lg border-border/50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-center text-center pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "Logo",
						className: "h-40 w-40 object-contain dark:invert"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-3xl font-serif font-bold tracking-tight text-black",
					children: "Post Perfector"
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "login",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full grid-cols-2 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "login",
							onClick: () => {
								setError("");
								setMessage("");
							},
							children: "Entrar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "signup",
							onClick: () => {
								setError("");
								setMessage("");
							},
							children: "Cadastrar"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "login",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleLogin,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										placeholder: "seu@email.com",
										value: loginEmail,
										onChange: (e) => setLoginEmail(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Senha"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										type: "password",
										value: loginPassword,
										onChange: (e) => setLoginPassword(e.target.value),
										required: true
									})]
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-destructive font-medium",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full mt-4",
									type: "submit",
									disabled: isSubmitting,
									children: [isSubmitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedIcon, {
										name: "loader",
										className: "mr-2 h-4 w-4 animate-spin"
									}), "Entrar"]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "signup",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSignup,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signup-name",
										children: "Nome"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signup-name",
										type: "text",
										placeholder: "Seu nome completo",
										value: name,
										onChange: (e) => setName(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "signup-email",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "signup-email",
										type: "email",
										placeholder: "seu@email.com",
										value: signupEmail,
										onChange: (e) => setSignupEmail(e.target.value),
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "signup-password",
											children: "Senha"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "signup-password",
											type: "password",
											value: signupPassword,
											onChange: (e) => setSignupPassword(e.target.value),
											required: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: "A senha deve ter no mínimo 8 caracteres, conter letra maiúscula, minúscula, número e caractere especial."
										})
									]
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-destructive font-medium",
									children: error
								}),
								message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-green-500 font-medium",
									children: message
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "w-full mt-4",
									type: "submit",
									disabled: isSubmitting,
									children: [isSubmitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedIcon, {
										name: "loader",
										className: "mr-2 h-4 w-4 animate-spin"
									}), "Criar Conta"]
								})
							]
						})
					})
				]
			}) })]
		})
	});
}
//#endregion
export { LoginScreen as component };
