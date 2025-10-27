import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { login, loginWithMicrosoft } from "@/utils/api/login";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { LOGO_URL, TOKEN_KEY } from "../utils/constant";
import { useMsal } from "@azure/msal-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debugInfo, setDebugInfo] = useState({});
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const { instance, accounts, inProgress } = useMsal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDebugInfo((prev) => ({
      ...prev,
      loginAttempt: new Date().toISOString(),
      emailAttempt: email,
      method: "manual",
    }));

    try {
      await login(dispatch, email, password);
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        localStorage.setItem("userEmail", email);
        navigate("/", { replace: true });
      } else {
        setError("No token found after login.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
      setDebugInfo((prev) => ({
        ...prev,
        error: err.toString(),
        errorStack: err.stack,
      }));
    }
  };

  const handleMicrosoftLogin = async () => {
    setError(null);
    setDebugInfo((prev) => ({
      ...prev,
      msLoginAttempt: new Date().toISOString(),
      msalInstanceAvailable: !!instance,
      inProgress,
      accounts: accounts?.length || 0,
    }));

    try {
      const token = await loginWithMicrosoft(instance);
      if (token) {
        setDebugInfo((prev) => ({
          ...prev,
          msLoginSuccess: true,
          tokenReceived: true,
          lastSuccess: new Date().toISOString(),
        }));
        navigate("/");
      } else {
        setError("No token received from Microsoft login");
      }
    } catch (err) {
      console.error("Microsoft login failed:", err);
      setError(err.message || "Microsoft login failed");
      setDebugInfo((prev) => ({
        ...prev,
        msLoginError: err.toString(),
        errorStack: err.stack,
      }));
    }
  };

  return (
    <div className='flex flex-col gap-8 items-center justify-center h-full'>
      <img src={LOGO_URL} alt='Logo' className='h-12 object-contain' />
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
              <p className='font-bold'>Login Error</p>
              <p className='text-sm'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='email' className='mb-2'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='password' className='mb-2'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='small' className='text-white' />
                  Login
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <p className='text-center mt-4 mb-2'>OR</p>

          <Button onClick={handleMicrosoftLogin} className='w-full'>
            SBL User
          </Button>

          {/* Debug Panel */}
          <div className='mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md'>
            <div className='flex justify-between items-center mb-2'>
              <h3 className='font-semibold text-sm text-gray-700'>
                Debug Information
              </h3>
              <button
                onClick={() =>
                  setDebugInfo((prev) => ({
                    ...prev,
                    refreshedAt: new Date().toISOString(),
                  }))
                }
                className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200'
              >
                Refresh
              </button>
            </div>

            <div className='grid grid-cols-2 gap-4 text-xs'>
              <div className='space-y-1'>
                <p>
                  <span className='font-medium'>Status:</span>{" "}
                  {loading ? "Loading..." : "Ready"}
                </p>
                <p>
                  <span className='font-medium'>MSAL Instance:</span>{" "}
                  {instance ? "✅ Available" : "❌ Not available"}
                </p>
                <p>
                  <span className='font-medium'>Accounts:</span>{" "}
                  {accounts?.length || 0} found
                </p>
                <p>
                  <span className='font-medium'>In Progress:</span>{" "}
                  {inProgress || "None"}
                </p>
              </div>

              <div className='space-y-1'>
                <p>
                  <span className='font-medium'>Last Update:</span>{" "}
                  {new Date().toLocaleTimeString()}
                </p>
                <p>
                  <span className='font-medium'>Environment:</span>{" "}
                  {process.env.NODE_ENV}
                </p>
                <p>
                  <span className='font-medium'>Token in Storage:</span>{" "}
                  {localStorage.getItem(TOKEN_KEY)
                    ? "✅ Found"
                    : "❌ Not found"}
                </p>
              </div>
            </div>

            <details className='mt-3'>
              <summary className='text-xs font-medium text-gray-600 cursor-pointer'>
                Show Raw Debug Data
              </summary>
              <pre className='mt-2 p-2 bg-white border rounded max-h-40 overflow-auto text-xs'>
                {JSON.stringify(
                  {
                    timestamp: new Date().toISOString(),
                    environment: process.env.NODE_ENV,
                    msal: {
                      instanceAvailable: !!instance,
                      accounts: accounts?.map((a) => ({
                        username: a.username,
                        homeAccountId:
                          a.homeAccountId?.substring(0, 10) + "...",
                      })),
                      inProgress,
                    },
                    storage: {
                      hasToken: !!localStorage.getItem(TOKEN_KEY),
                      email: localStorage.getItem("userEmail") || null,
                    },
                    ...debugInfo,
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
