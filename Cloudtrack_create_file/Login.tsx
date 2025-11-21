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

