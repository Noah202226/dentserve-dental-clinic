import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export default function AuthForm({ handleSubmit, submitType, onToggle }) {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await handleSubmit(e); // your login/signup logic
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-gradient-to-b from-white to-green-50 border border-green-100 shadow-2xl rounded-2xl">
      <form onSubmit={onSubmit} className="card-body space-y-6 p-8">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-green-700 text-center">
          {submitType === "Sign Up" ? "Create an Account" : "Welcome Back"}
        </h2>

        {/* Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-green-800 font-medium">Email</span>
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full border-green-300 focus-within:border-green-500 rounded-xl bg-white shadow-sm transition-all">
            <Mail className="w-5 h-5 text-green-600 opacity-80" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              // defaultValue={} // test only
              required
              className="grow text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none"
            />
          </label>
        </div>

        {/* Password */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-green-800 font-medium">
              Password
            </span>
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full border-green-300 focus-within:border-green-500 rounded-xl bg-white shadow-sm transition-all">
            <Lock className="w-5 h-5 text-green-600 opacity-80" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              // defaultValue={} // test only
              required
              className="grow text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none"
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300 ease-in-out"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              {submitType}...
            </>
          ) : (
            submitType
          )}
        </button>

        {/* Toggle */}
        {onToggle && (
          <p className="text-center text-sm text-gray-600">
            {submitType === "Sign Up" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onToggle}
                  className="text-green-700 font-semibold hover:underline"
                  disabled={loading}
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={onToggle}
                  className="text-green-700 font-semibold hover:underline"
                  disabled={loading}
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        )}
      </form>
    </div>
  );
}
