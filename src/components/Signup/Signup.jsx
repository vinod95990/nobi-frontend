"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import AuthService from "@/src/services/auth";
import { useRouter } from "next/navigation";
import { addUserDetail } from "@/src/slices/authSlice";
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

  return (
    <div
      className="w-full p-5 flex gap-4 flex-col text-2xl"
      style={{
        height: "100%",
        position: "relative",
        zIndex: "4",
      }}
    >
      <div className="flex justify-center gap-4 items-center w-full mb-2">
        <div
          onClick={() => handleAuthStateChange(authStateTypes.signup)}
          className={`${
            authState == authStateTypes.signup
              ? "doodle-active"
              : "doodle-white"
          } cursor-pointer`}
        >
          <p className="text-base sm:text-xl">Signup</p>
        </div>
        <div
          onClick={() => handleAuthStateChange(authStateTypes.login)}
          className={`${
            authState == authStateTypes.login ? "doodle-active" : "doodle-white"
          } cursor-pointer`}
        >
          <p className="text-base sm:text-xl">Login</p>
        </div>
      </div>

      {/* form */}
      <div className="text-white auth-form mx-2 sm:mx-6 sm:my-4 ">
        <form onSubmit={formik.handleSubmit} className="text-center">
          {authState == authStateTypes.signup && (
            <div>
              <label htmlFor="name" className="flex items-center gap-4">
                <p className="text-base sm:text-2xl">User name</p>
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-lg text-rose-400	text-center">
                    {"{ "}
                    {formik.errors.name} {" }"}
                  </div>
                ) : null}
              </label>
              <input
                className=" auth-form-input font-sans text-base sm:text-lg"
                placeholder="Who are you in this magical realm?"
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
          )}
          <div>
            <label htmlFor="emailId" className="flex items-center gap-4">
              <p className="text-base sm:text-2xl">Email Address</p>
              {formik.touched.emailId && formik.errors.emailId ? (
                <div className="text-lg text-rose-400	text-center">
                  {"{ "} {formik.errors.emailId} {" }"}
                </div>
              ) : null}
            </label>
            <input
              className=" auth-form-input font-sans text-base sm:text-lg"
              id="emailId"
              name="emailId"
              placeholder="Where should the forest owls send your messages?"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.emailId}
            />
          </div>
          <div>
            <label htmlFor="password" className="flex items-center gap-4">
              <p className="text-base sm:text-2xl">Password</p>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-lg text-rose-400	text-center">
                  {"{ "}
                  {formik.errors.password}
                  {" }"}
                </div>
              ) : null}
            </label>{" "}
            <input
              className=" auth-form-input font-sans text-base sm:text-lg "
              id="password"
              name="password"
              type="password"
              placeholder="Speak the words that unlock the hidden grove"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </div>
          {formik.isSubmitting ? (
            <div className="relative my-3">
              <Loader />
            </div>
          ) : (
            <button
              type="submit"
              className={`text-center text-base sm:text-xl ${
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
    </div>
  );
}
