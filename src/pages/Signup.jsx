import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { handleerror, handlesuccess } from "../../util";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      handleerror("Please fill in all fields");
      return;
    }
    // Add your signup logic here

    try {
     
      const res = await axios.post(`{import.meta.env.VITE_API_URL}/user/signup`, {
        name,
        email,
        password,
      }

      
);
      if (res.data.success) {
        handlesuccess("Signup Successfull");
        navigate("/login");
      }
    } catch (err) {
      handleerror(err.response.data.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-wider text-center text-white mb-8">
        COLLABORATIVE CODING
      </h1>

      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-lg p-10 space-y-8 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="relative block w-full px-4 py-3 rounded-t-md border-b-4 border-gray-800 focus:outline-none focus:ring-border-gray-800 focus:border-border-gray-800 focus:z-40 font-stretch-100% sm:text-sm bg-gray-700 text-white"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-4 py-3 border-b-4 border-gray-800 focus:outline-none focus:ring-border-gray-800 focus:border-border-gray-800 focus:z-40 font-stretch-100% sm:text-sm bg-gray-700 text-white"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-4 py-3 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-40 sm:text-sm bg-gray-700 text-white"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
