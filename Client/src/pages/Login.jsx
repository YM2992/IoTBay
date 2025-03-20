import React from "react";

function Login() {
  return (
<div className="flex items-center justify-center h-screen w-full bg-gradient-to-b from-blue-200 to-blue-400">
<div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <div className="flex">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold justify-center">IotBay</span>
            </div>
            <h2 className="text-2xl font-semibold">Welcome!</h2>
            <p className="text-gray-600 ">
              Please sign-in to your account below
            </p>
          </div>
        </div>
        <input
          type="text"
          placeholder="Email"
          className="w-full text-black p-3 border rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border text-black rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-right mb-4">
          <a href="#" className="text-blue-500 text-sm ">
            Forgot Password?
          </a>
        </div>
        <button className="w-full bg-blue-300 text-white rounded-lg hover:bg-blue-700 transition">
          Sign in
        </button>
        <p className="text-center text-gray-600 mt-4">
          Having problems?{" "}
          <a href="#" className="text-blue-500">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;