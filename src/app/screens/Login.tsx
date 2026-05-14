import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import { 
  OTPInput,
} from "input-otp";

/**
 * Numeric OTP Login screen.
 * This component handles the two-step verification process:
 * 1. Email entry -> Send numeric code.
 * 2. OTP entry -> Verify code and login.
 */
export default function Login() {
    // Authentication states
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"email" | "otp">("email"); // Current view (Email or OTP)
    const [isLoading, setIsLoading] = useState(false); // Controls loading spinners
    const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Specifically for Google login
    const [error, setError] = useState<string | null>(null); // Displays error messages
    const [resendCountdown, setResendCountdown] = useState(0); // Timer for OTP resend cooldown
    
    const { signInWithOtp, verifyOtp, signInWithGoogle, session } = useAuth();
    const { profile, loading: profileLoading } = useUserProfile();
    const navigate = useNavigate();

    // Automatically redirect once auth + profile are fully loaded
    useEffect(() => {
        if (!profileLoading && session) {
            console.log("[Login] Profile loaded, onboarded =", profile.onboarded);
            if (profile.onboarded) {
                navigate("/home", { replace: true });
            } else {
                navigate("/onboarding", { replace: true });
            }
        }
    }, [session, profile.onboarded, profileLoading, navigate]);

    /**
     * Handles Google OAuth login.
     */
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
            setIsGoogleLoading(false);
        }
        // Redirect is handled by Supabase OAuth
    };

    // Timer logic: decrements the countdown every second
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendCountdown > 0) {
            timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendCountdown]);

    /**
     * Step 1: Send numeric OTP to user's email
     */
    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError(null);

        const { error } = await signInWithOtp(email);

        setIsLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setStep("otp");
            setResendCountdown(60); // Set 60s cooldown for resending
        }
    };

     /**
     * Step 2: Verify the numeric code (supports 6-8 digits)
     */
    const handleVerifyOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (otp.length < 6 || otp.length > 8) return;

        setIsLoading(true);
        setError(null);

        const { error } = await verifyOtp(email, otp);

        setIsLoading(false);
        if (error) {
            setError(error.message);
            setOtp(""); // Reset OTP on error
        } else {
            // Success! The useEffect will handle redirecting to /home or /onboarding
            // based on the profile's onboarded status once it loads.
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
            <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                        Aura Beauty
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {step === "email" 
                            ? "Enter your email to receive a numeric login code" 
                            : `We sent a numeric code to ${email}`}
                    </p>
                </div>

                {error && (
                    <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-lg border border-destructive/20 animate-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {step === "email" ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || isGoogleLoading || !email}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 py-2 w-full shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            ) : (
                                "Send Numeric Code"
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isLoading || isGoogleLoading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-4 py-2 w-full shadow-sm"
                        >
                            {isGoogleLoading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Continue with Google
                                </div>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="flex flex-col items-center space-y-6">
                             <OTPInput
                                maxLength={8}
                                value={otp}
                                onChange={setOtp}
                                onComplete={() => handleVerifyOtp()}
                                inputMode="numeric" // Force numeric keyboard on mobile
                                containerClassName="group flex items-center has-[:disabled]:opacity-30"
                                render={({ slots }) => (
                                    <div className="flex gap-1">
                                        {slots.map((slot, idx) => (
                                            <Slot key={idx} {...slot} />
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <button
                                type="submit"
                                 disabled={isLoading || otp.length < 6 || otp.length > 8}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 py-2 w-full shadow-lg shadow-primary/20"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                ) : (
                                    "Verify & Login"
                                )}
                            </button>
                            
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleSendOtp()}
                                    disabled={isLoading || resendCountdown > 0}
                                    className="text-sm font-medium text-primary hover:underline disabled:no-underline disabled:text-muted-foreground transition-colors"
                                >
                                    {resendCountdown > 0 
                                        ? `Resend code in ${resendCountdown}s` 
                                        : "Didn't receive a code? Resend"}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => setStep("email")}
                                    disabled={isLoading}
                                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Use a different email address
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

/**
 * Premium OTP slot component with focus effects.
 */
function Slot(props: { char: string | null; isActive: boolean; isPlaceholder: boolean }) {
    return (
      <div
        className={`relative flex h-14 w-11 items-center justify-center border-2 rounded-xl text-lg font-bold transition-all ${
          props.isActive 
            ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
            : "border-input bg-background"
        } ${props.char ? "border-primary/50 text-primary" : "text-muted-foreground"}`}
      >
        {props.char !== null && <div className="animate-in zoom-in-50 duration-200">{props.char}</div>}
        {props.char === null && props.isActive && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-0.5 animate-caret-blink bg-primary duration-1000" />
          </div>
        )}
      </div>
    );
  }