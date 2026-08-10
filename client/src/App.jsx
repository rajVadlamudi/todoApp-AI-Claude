import { SignedIn, SignedOut } from "@clerk/clerk-react";
import TodoApp from "./components/TodoApp";
import AuthScreen from "./components/AuthScreen";
import "./App.css";

export default function App() {
  return (
    <>
      <SignedOut>
        <AuthScreen />
      </SignedOut>
      <SignedIn>
        <TodoApp />
      </SignedIn>
    </>
  );
}
