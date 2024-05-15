"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import AuthService from "@/src/services/auth";
import { useRouter } from "next/navigation";
import "./Signup.css";
import Image from "next/image";

import Loader from "../Common/Loader";
import { toast } from "react-toastify";
const authStateTypes = {
  login: "login",
  signup: "signup",
};

const formDataBasedOnAuthType = {
  login: {
    validation: Yup.object({
      emailId: Yup.string()
        .email("The moonbeams can't find that address")
        .required("Share your secret garden email."),
      password: Yup.string().required("The forest guardians need a password."),
    }),
    initialValues: {
      emailId: "",
      password: "",
    },
  },
  signup: {
    validation: Yup.object({
      name: Yup.string()
        .max(15, "Must be of 15 pixies or less")
        .required("Every forest spirit needs a name!"),

      emailId: Yup.string()
        .email("The moonbeams can't find that address")
        .required("Share your secret garden email."),
      password: Yup.string()
        .max(20, " The ancient trees can't remember more than 20 runes.")
        .required(
          "The forest guardians need a password to protect its secrets."
        ),
    }),
    initialValues: {
      emailId: "",
      password: "",
      name: "",
    },
  },
};

export default function Signup(props) {
  const router = useRouter();
  const [authState, setAuthState] = useState(authStateTypes.login);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: formDataBasedOnAuthType[authState].initialValues,
    validationSchema: formDataBasedOnAuthType[authState].validation,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    if (authState == authStateTypes.signup) {
      try {
        const res = await AuthService.signup(values);

        if (res?.error) {
          toast.error(res?.error, {
            className: "toast-message",
          });
        }
        if (res?.data) {
          router.push("/");
        }
      } catch (error) {
        toast.error(
          error?.message || "Something went wrong! Please try again later",
          {
            className: "toast-message",
          }
        );
      }
    } else {
      try {
        const res = await AuthService.login(values);
        if (res?.error) {
          toast.error(res?.error, {
            className: "toast-message",
          });
        }

        if (res.data) {
          router.push("/");
        }
      } catch (error) {
        toast.error(
          error?.message || "Something went wrong! Please try again later",
          {
            className: "toast-message",
          }
        );
      }
    }
  }

  function handleAuthStateChange(state) {
    setAuthState(state);
    formik.resetForm();
  }

  async function handleGoogleLogin() {
    await AuthService.googleLogin();
  }

  return (
    <div
      className="w-full p-5 flex gap-4 flex-col text-2xl pb-5"
      style={{
        position: "relative",
        zIndex: "4",
      }}
    >
      <div className="flex justify-center gap-4 items-center  mb-2 bg-white rounded-lg p-3">
        <div
          onClick={() => handleAuthStateChange(authStateTypes.signup)}
          className={`${
            authState == authStateTypes.signup
              ? "auth-active"
              : "auth-non-active"
          } cursor-pointer`}
        >
          <p className="text-base sm:text-xl">Signup</p>
        </div>
        <div
          onClick={() => handleAuthStateChange(authStateTypes.login)}
          className={`${
            authState == authStateTypes.login
              ? "auth-active"
              : "auth-non-active"
          } cursor-pointer`}
        >
          <p className="text-base sm:text-xl">Login</p>
        </div>
      </div>

      {/* form */}
      <div
        className="bg-white rounded-lg p-4"
        style={{ border: "3px solid #3d3266" }}
      >
        <form onSubmit={formik.handleSubmit} className="auth-form">
          {authState == authStateTypes.signup && (
            <div className="flex items-center justify-center gap-1 flex-col">
              <label htmlFor="name" className="flex items-center gap-4">
                <p className="text-lg">User name</p>
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-lg text-rose-400	text-center">
                    {"{ "}
                    {formik.errors.name} {" }"}
                  </div>
                ) : null}
              </label>
              <div className="auth-doodle-input">
                <input
                  className=" font-sans text-base sm:text-lg"
                  placeholder="Your name 😊"
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />{" "}
              </div>
            </div>
          )}
          <div className="flex items-center justify-center gap-1 flex-col">
            <label htmlFor="emailId" className="flex items-center gap-4">
              <p className="text-lg">Email Address</p>
              {formik.touched.emailId && formik.errors.emailId ? (
                <div className="text-lg text-rose-400	text-center">
                  {"{ "} {formik.errors.emailId} {" }"}
                </div>
              ) : null}
            </label>
            <div className="auth-doodle-input">
              <input
                className=" font-sans text-base sm:text-lg"
                id="emailId"
                name="emailId"
                placeholder="Your email 📧"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.emailId}
              />
            </div>
          </div>
          <div className="flex items-center justify-center flex-col">
            <label
              htmlFor="password "
              className="flex items-center justify-center gap-4"
            >
              <p className="text-lg">Password</p>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-lg text-rose-400	text-center">
                  {"{ "}
                  {formik.errors.password}
                  {" }"}
                </div>
              ) : null}
            </label>
            <div className=" auth-doodle-input">
              <input
                className=" font-sans text-base sm:text-lg"
                id="password"
                name="password"
                type="password"
                placeholder="Password 🔑"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </div>
          </div>

          {formik.isSubmitting ? (
            <div className="relative my-4">
              <Loader />
            </div>
          ) : (
            <button
              type="submit"
              className={`text-center text-base sm:text-xl auth-doodle-btn ${
                Object.keys(formik.errors).length > 0
                  ? "text-slate-700 opacity-30 none"
                  : "opacity-100 none "
              }`}
              disabled={
                formik.isSubmitting || Object.keys(formik.errors).length > 0
                  ? true
                  : false
              }
            >
              Submit
            </button>
          )}
        </form>
      </div>
      <div className="flex items-center text-[#3d3266] justify-center text-center text-2xl sm:text-4xl my-4">
        - OR -{" "}
      </div>
      <div
        onClick={handleGoogleLogin}
        style={{ border: "3px solid #3d3266" }}
        className="flex items-center justify-center  gap-2 m-2 bg-white p-3 rounded-lg "
      >
        <Image
          src="/../../icons/google.png"
          width={40}
          height={40}
          alt="sparkle"
          className=" cursor-pointer w-6 sm:w-10"
        ></Image>
      </div>
    </div>
  );
}
