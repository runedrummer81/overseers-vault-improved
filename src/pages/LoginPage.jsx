import { useState, useEffect, useRef } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";

function Flourish({ flip = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 257.6 130.8"
      className={`fill-secondary w-8 h-auto shrink-0 ${flip ? "-scale-x-100" : ""}`}
    >
      <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
      <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const scaleY = useMotionValue(1);
  const passwordRef = useRef(null);

  const basePath = import.meta.env.DEV ? "" : "/overseers-vault-improved";

  // Blinking eye
  useEffect(() => {
    let mounted = true;
    const blink = async () => {
      while (mounted) {
        if (!isPasswordFocused || showPassword) {
          await new Promise((r) => setTimeout(r, 5000 + Math.random() * 3000));
          await animate(scaleY, 0.1, { duration: 0.15, ease: "easeInOut" });
          await new Promise((r) => setTimeout(r, 800 + Math.random() * 300));
          await animate(scaleY, 1, { duration: 0.25, ease: "easeOut" });
        } else {
          await animate(scaleY, 0.01, { duration: 0.2 });
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    };
    blink();
    return () => {
      mounted = false;
    };
  }, [scaleY, isPasswordFocused, showPassword]);

  // Auto-dismiss error after 4 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  // Auto-dismiss message after 4 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleEmailAuth = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      if (err.code === "auth/user-not-found")
        setError("No account found with that email.");
      else if (err.code === "auth/wrong-password")
        setError("Incorrect password.");
      else if (err.code === "auth/email-already-in-use")
        setError("An account with this email already exists.");
      else if (err.code === "auth/weak-password")
        setError("Password must be at least 6 characters.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    if (!email) {
      setError("Enter your email above first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("A reset scroll has been sent to your inbox!");
    } catch (err) {
      setError("Could not send reset email. Check the address and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={`${basePath}/images/login.jpg`}
          alt="background"
          className="w-full h-full object-cover"
        />
        <video
          src={`${basePath}/videos/mist.webm`}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-40"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to left, transparent 80%, #141411 100%),
              linear-gradient(to right, transparent 80%, #141411 100%),
              linear-gradient(to bottom, transparent 80%, #141411 100%),
              linear-gradient(to top, transparent 80%, #141411 100%)
            `,
          }}
        />
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center w-full max-w-sm px-6">
        {/* Logo */}
        <div className="mb-12" style={{ width: "500px" }}>
          <img
            src={`${basePath}/images/logo.svg`}
            alt="The Overseer's Vault"
            className="w-full object-contain"
          />
        </div>

        {/* Animated form area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isRegistering ? "register" : "login"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col items-center"
          >
            {/* Email input */}
            <div className="w-full border-2 border-secondary p-2 mb-4 transition-colors duration-200 focus-within:border-primary">
              <input
                type="email"
                placeholder="Adventurer's Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 text-primary placeholder-secondary bg-transparent focus:outline-none transition duration-200"
              />
            </div>

            {/* Password input */}
            <div className="w-full border-2 border-secondary p-2 mb-2 relative transition-colors duration-200 focus-within:border-primary">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Secret Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => {
                  setIsPasswordFocused(false);
                  animate(scaleY, 1, { duration: 0.3, ease: "easeOut" });
                }}
                className="w-full p-3 text-primary placeholder-secondary bg-transparent focus:outline-none transition duration-200"
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  passwordRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition duration-200"
              >
                <motion.div style={{ scaleY, originY: 0.5 }}>
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </motion.div>
              </button>
            </div>

            {/* Forgot password — only shown on login mode */}
            {!isRegistering && (
              <div className="w-full flex justify-end mb-4">
                <button
                  onClick={handleForgotPassword}
                  className="text-secondary text-xs hover:text-primary transition-colors"
                >
                  Lost your magical key?
                </button>
              </div>
            )}

            {/* Enter Realm / Forge Account button */}
            <button
              onClick={handleEmailAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 uppercase text-primary hover:text-secondary text-3xl font-bold hover:drop-shadow-2xl transition-all duration-300 mb-6 whitespace-nowrap"
            >
              <Flourish flip />
              {loading
                ? "Loading..."
                : isRegistering
                  ? "Forge Account"
                  : "Enter Realm"}
              <Flourish />
            </button>

            {/* Divider */}
            <div className="w-full flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-dark-border" />
              <span className="text-secondary text-xs uppercase tracking-widest">
                or
              </span>
              <div className="flex-1 h-px bg-dark-border" />
            </div>

            {/* Google sign in */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-dark-border text-primary py-3 hover:text-secondary hover:border-secondary transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Sign up / Sign in link */}
            <p className="text-secondary text-lg mt-6 text-center">
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account yet?"}{" "}
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-primary font-bold underline hover:text-secondary transition-colors"
              >
                {isRegistering ? "Sign in instead" : "Sign up"}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error message — fixed at bottom, never pushes layout */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 text-red-400 text-2xl font-bold text-center pointer-events-none whitespace-nowrap"
            style={{
              textShadow:
                "0 0 10px rgba(239, 68, 68, 0.8), 0 0 20px rgba(239, 68, 68, 0.4)",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success message — fixed at bottom */}
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 text-primary text-2xl font-bold text-center pointer-events-none whitespace-nowrap"
            style={{
              textShadow:
                "0 0 10px rgba(218, 202, 137, 0.8), 0 0 20px rgba(218, 202, 137, 0.4)",
            }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
