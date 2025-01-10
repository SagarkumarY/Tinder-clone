import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

function LoginFrom() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return; // Stop execution here if fields are empty
    }

    await login({ email, password });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className=" block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <div className="mt-1">
          <input
            type="email"
            id="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500  focus:border-pink-500 sm:text-sm "
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className=" block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <div className="mt-1">
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500  focus:border-pink-500 sm:text-sm "
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex  justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading
            ? "bg-pink-400  cursor-not-allowed"
            : "bg-pink-600  hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        }`}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default LoginFrom;
