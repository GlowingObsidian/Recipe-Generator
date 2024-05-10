"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prevSignInData) => ({
      ...prevSignInData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signInResult = await signIn("credentials", {
      email: signInData.email,
      password: signInData.password,
      callbackUrl: "http://localhost:3000/",
    });
    if (signInResult?.error) {
      // Handle sign-in error
      console.log("Sign-in error:", signInResult.error);
    }
  };

  console.log(signInData);

  return (
    <div>
      {!session ? (
        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-3xl flex flex-col gap-7 glassmorphism"
        >
          <label>
            <span className="font-satoshi font-semibold text-base text-gray-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form_input"
              onChange={handleChange}
              // value={formData.username}
            />
          </label>

          <label>
            <span className="font-satoshi font-semibold text-base text-gray-700">
              Password
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form_input"
              onChange={handleChange}
              // value={formData.password}
            />
          </label>

          <button
            type="submit"
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-black"
          >
            Sign in
          </button>
        </form>
      ) : (
        <p>Welcome, {session.user.name}!</p>
      )}
    </div>
  );
};

export default SignInForm;
