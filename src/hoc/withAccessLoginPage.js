"use client";

import { useRouter } from "next/navigation";
import AuthService from "../services/auth";
import { useEffect, useState } from "react";
import { addUserDetail } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Common/Loader";
import { toast } from "react-toastify";

export default function withAuthAccessLoginPage(WrappedComponent) {
  return function WrappedComponentWithAuthAcessHOC(props) {
    const router = useRouter();
    let { userDetails } = useSelector((state) => state.auth);

    /* userDetailState ka purpose sirf yahi ki, niche loading ya page ki condition jo hai agar userDetailsState 
    nhi hai i.e initial state null hai toh bahi hume me() per req dalni padegi check karne keliye ki cookie toh nhi
    hai, agar cookie hue toh yeh if(data) pe useEffect pe hum yeh state will update to that data, agarr nhi hai
    cookie toh data toh ayega ni toh ab data nhi hai toh yeh redux state ko toh userDetails = true ya xyz karenge nhi
    hume ek state chahiye jisko jab data na aye toh specific string assign karde ki bahi yeh niche jo loading ya page ki
    condition hai usmei tu signin page dikha de
    */
    const [userDetailsState, setUserDetailsState] = useState(userDetails);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
      if (!userDetailsState) {
        async function me() {
          setIsLoading(false);

          const { data, error, unauthorized } = await AuthService.me();

          if (unauthorized) {
            setUserDetailsState(
              "setting this true in order to make the below condtion work"
            );
          }

          if (error?.serverError) {
            toast.error(error, { className: "toast-message" });
            setIsError(error);
          }

          if (data) {
            dispatch(addUserDetail(data?.userData));
            setIsLoading(false);
            setUserDetailsState(data?.userData);
            router.push("/");
          }
          setIsLoading(false);
        }

        me();
      }
    }, [router, dispatch, userDetailsState]);

    if (userDetails) {
      router.push("/");
    }

    //agar network error hai i.e. server is down tab tk show this for now
    if (isError) {
      return <>{isError}</>;
    }
    // yahn pe show loading if isLoading is true or yeh true hoga after all sync code has executed, agar
    // sirf isko hi rkhte toh sidha login page dikha deta kyuki isLoading sync mei toh is false, yeh
    // userDetailsState agar nhi hai toh bhi show loader,or yeh isiliye ki bahi check karlo token toh nhi hai
    //kahi user pe, agar hai to redirect to /, nhi hai toh make this state as "setting this true in order to make the below condtion work"
    // yeh string ka purpose ki bahi yeh state niche false hojaye !string jisse we will see the login page
    return isLoading || !userDetailsState ? (
      <Loader />
    ) : (
      <WrappedComponent {...props} />
    );
  };
}
