import React from "react";
import Button from "./micro/Button";
import { Form, Link, useActionData, useSearchParams } from "react-router-dom";

const inputStyle =
  "border border-gray-300 px-4 py-2 mt-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none font-serif rounded-lg w-full transition duration-300 ease-in-out";

const Auth = () => {
  const data = useActionData();
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg px-10 py-6 w-full max-w-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-4 text-center">
          Career Launcher Dehradun
        </h1>
        <Form method="post" className="flex flex-col gap-4 pt-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className={inputStyle}
              />
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={inputStyle}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={inputStyle}
            />
          </div>
          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={inputStyle}
              />
            </div>
          )}
          <Button>{`${isLogin ? "Login" : "Register"}`}</Button>
        </Form>

        <p className="mt-4 text-center">
          {`${
            isLogin ? "Don't have an account? " : "Already have an account? "
          }`}
          <Link
            to={`?mode=${isLogin ? "register" : "login"}`}
            className="text-blue-600 font-semibold hover:underline transition duration-300 ease-in-out">{`${
            isLogin ? "Register" : "Login"
          }`}</Link>
        </p>

        <div className="mt-4 text-center min-h-[40px]">
          {data && data.message && (
            <p className="text-red-600">{data.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
