"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";
import { loginUser } from "@/utils/services/authservice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "./ui/spinner";
import { Route } from "src/utils/routes";
import { LOCAL_STORAGE_KEYS, MESSAGES, USER_ROLES } from "@/utils/constants";
import { toast } from "sonner";
import Image from "next/image";
import GoogleLogo from "public/images/googleLogo.svg";
import MicrosoftLogo from "public/images/microsoftLogo.svg";
import PasswordInput from "./common/passwordinput";
import { RootState } from "@/store";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const userRole = useSelector(
    (state: RootState) => state.auth.userRole?.userRole
  );
  const role =
    typeof userRole === "string" ? userRole.trim().toLowerCase() : undefined;

  const [formState, setFormState] = useState({
    isLoading: false,
    error: null as string | null,
    email: "",
    password: "",
    passwordVisible: false,
    rememberMe: false,
  });

  // Handle initial state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle localStorage access
  useEffect(() => {
    if (!mounted) return;

    try {
      const storedRememberMe = localStorage.getItem(LOCAL_STORAGE_KEYS.REMEMBER_ME);
      const storedEmail = localStorage.getItem(LOCAL_STORAGE_KEYS.EMAIL);

      if (storedRememberMe === "true" && storedEmail) {
        setFormState((prevState) => ({
          ...prevState,
          rememberMe: true,
          email: storedEmail,
        }));
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [mounted]);

  // Handle error toast
  useEffect(() => {
    if (!mounted) return;

    if (formState.error) {
      toast.error(MESSAGES.ERROR.LOGIN_FAILED, {
        description: formState.error,
      });
    }
  }, [formState.error, mounted]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!mounted) return;

    setFormState((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    // Validation
    const loginValidation = loginSchema.safeParse({
      email: formState.email,
      password: formState.password,
    });

    if (!loginValidation.success) {
      loginValidation.error.errors.forEach((err) => {
        toast.warning(err.message);
      });
      setFormState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
      return;
    }

    try {
      // Handle "Remember me" state
      if (formState.rememberMe) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.REMEMBER_ME, "true");
        localStorage.setItem(LOCAL_STORAGE_KEYS.EMAIL, formState.email);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.REMEMBER_ME);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.EMAIL);
      }

      // Authenticate
      const loginResponse = await loginUser(
        formState.email,
        formState.password,
        dispatch
      );

      if (!loginResponse?.accessToken) {
        setFormState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: MESSAGES.WARNING.INVALID_EMAIL_PASSWORD,
        }));
        return;
      } else {
        toast.success(MESSAGES.SUCCESS.LOGIN || loginResponse?.message);
        if (role === USER_ROLES.TRANSPORTER) {
          router.push(Route.indent);
        } 
         if (role === USER_ROLES.ADMIN) {
          router.push(Route.dashboard);
        } 
      }
    } catch (error) {
      setFormState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: MESSAGES.ERROR.INVALID_CREDENTIALS,
      }));
      console.error(error);
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-[700]">Welcome back</CardTitle>
          {/* <CardDescription>
            Login with your Google or Microsoft account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => router.push(Route.google)}
                >
                  <Image src={GoogleLogo} alt="Google logo" />
                  Login with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => router.push(Route.microsoft)}
                >
                  <Image src={MicrosoftLogo} alt="Microsoft logo" />
                  Login with Microsoft
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div> */}
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    placeholder="Enter your email address"
                    onChange={(e) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        email: e.target.value,
                      }))
                    }
                    required
                    disabled={formState.isLoading}
                  />
                </div>
                <div className="grid gap-3">

                  <PasswordInput
                    id="password"
                    label="Password"
                    value={formState.password}
                    onChange={(e) => setFormState((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }))}
                    placeholder="Enter Password"
                    disabled={formState.isLoading}
                  />

                </div>
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formState.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormState((prevState) => ({
                          ...prevState,
                          rememberMe: checked as boolean,
                        }))
                      }
                      disabled={formState.isLoading}
                    />

                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href={Route.forgetPassword}
                    className="ml-auto text-sm font-normal underline-offset-4 hover:underline cursor-pointer p-0 h-auto"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-[#2563EB] text-white"
                  disabled={formState.isLoading}
                >
                  {formState.isLoading ? (
                    <Spinner size={"small"} className="text-white" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>
              {/* <div className="text-center text-sm">
                <span>Don&rsquo;t have an account?</span>{" "}
                <Link
                  href={Route.register}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  Sign up
                </Link>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}

