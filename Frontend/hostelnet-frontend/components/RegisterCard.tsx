"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";

export default function RegisterCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // EMAIL + PASSWORD
  const registerWithEmail = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // GOOGLE
  const loginWithGoogle = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // MICROSOFT
  const loginWithMicrosoft = async () => {
    setError("");
    try {
      const provider = new OAuthProvider("microsoft.com");
      provider.setCustomParameters({
        prompt: "consent",
      });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">

      {/* GOOGLE */}
      <button
        onClick={loginWithGoogle}
        className="w-full bg-black text-white py-3 rounded"
      >
        Continue with Google
      </button>

      {/* MICROSOFT */}
      <button
        onClick={loginWithMicrosoft}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        Continue with Microsoft
      </button>

      <div className="text-center text-gray-400">OR</div>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border p-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={registerWithEmail}
        className="w-full bg-green-600 text-white py-3 rounded"
      >
        Continue with Email
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
