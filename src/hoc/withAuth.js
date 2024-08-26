"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserDetail } from "../slices/authSlice";
import AuthService from "../services/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loader from "../components/Common/Loader";

export default function withAuth(WrappedComponent) {
  return function WrappedComponentWithAuth(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.auth);
    const [isError, setIsError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      if (!userDetails) {
        async function meRequest() {
          setIsLoading(true);
          const { data, error, unauthorized } = await AuthService.me();
          if (unauthorized) {
            setIsLoading(false);

            router.push("/guard-gate");
          }

          if (error?.serverError) {
            toast.error(error);
            setIsError(error);
          }

          if (data) {
            dispatch(addUserDetail(data?.userData));
          }
          setIsLoading(false);
        }
        meRequest();
      }
    }, [dispatch, userDetails, router]);

    if (userDetails) {
      return <WrappedComponent {...props} />;
    }

    //agar network error hai i.e. server is down tab tk show this for now
    if (isError) {
      return <>{isError}</>;
    }

    return isLoading || !userDetails ? (
      <Loader />
    ) : (
      <WrappedComponent {...props} />
    );
  };
}
