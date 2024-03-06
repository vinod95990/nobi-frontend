"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUserDetail } from "../slices/authSlice";
import AuthService from "../services/auth";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function me() {
      try {
        const { data, error } = await AuthService.me();
        if (error) {
          throw new Error(error);
        }

        if (data) {
          dispatch(addUserDetail(data));
        }
      } catch (error) {}
    }

    me();
  }, [dispatch]);

  return <>{children}</>;
}
