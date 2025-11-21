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
