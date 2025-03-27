import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-b from-blue-200 to-blue-400">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div
              className="absolute -translate-y-[5rem] w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center"
              style={{
                marginTop: "1rem",
              }}
            >
              <span className="text-xl font-bold justify-center text-black">
                IotBay
              </span>
            </div>
            <h2
              className="text-2xl text-black font-semibold translate-y-[4.75rem]"
              style={{}}
            >
              Welcome!
            </h2>
            <p
              className="text-gray-600 text-sm"
              style={{
                marginBottom: "2rem",
                paddingTop: "6.5rem",
              }}
            >
              Please sign-in to your account below
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "1rem",
            width: "17rem",
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <input
            type="email"
            placeholder="Email"
            className=" text-sm w-full text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              paddingLeft: "0.5rem",
              height: "2rem",
              border: "1px solid",
              borderColor: "#d3d3d3",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="text-sm w-full border text-black rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              paddingLeft: "0.5rem",
              height: "2rem",
              border: "1px solid",
              borderColor: "#d3d3d3",
            }}
          />
        </div>
        <div className="text-right">
          <a
            href="#"
            className="text-blue-500 text-sm "
            style={{
              display: "flex",
              flexDirection: "column",
              width: "8rem",
              marginLeft: "auto",
              marginRight: "auto",
              alignItems: "center",
            }}
          >
            Forgot Password?
          </a>
        </div>
        <button
          className="w-full bg-blue-300 text-white rounded-lg hover:bg-blue-700 transition"
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1rem",
            marginBottom: "1rem",
            width: "10rem",
            height: "2.5rem",
            borderRadius: "3rem",
            marginLeft: "auto",
            marginRight: "auto",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          Sign in
        </button>
        <p
          className="text-center text-gray-600 mt-4 text-sm"
          style={{
            marginBottom: "1rem",
          }}
        >
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
