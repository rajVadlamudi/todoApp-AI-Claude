import { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

export default function AuthScreen() {
  const [mode, setMode] = useState("sign-in");

  return (
    <div className="app">
      <div className="app__card app__card--auth">
        <header className="app__header">
          <h1>My Tasks</h1>
          <p className="app__subtitle">
            {mode === "sign-in" ? "Sign in to see your tasks" : "Create an account to get started"}
          </p>
        </header>

        {mode === "sign-in" ? (
          <SignIn routing="virtual" />
        ) : (
          <SignUp routing="virtual" />
        )}

        <p className="app__auth-switch">
          {mode === "sign-in" ? (
            <>
              Don't have an account?{" "}
              <button type="button" onClick={() => setMode("sign-up")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("sign-in")}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
