"use client";
import AuthService from "@/src/services/auth";
import "./Header.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    const res = await AuthService.logout();
    if (res?.unauthorized) {
      toast.info("Logged out successfully", {
        className: "toast-message",
      });
      router.push("/guard-gate");
    }

    if (res?.error) {
      toast.error(res?.error, {
        className: "toast-message",
      });
      return;
    }

    if (res?.data) {
      toast.success(res?.data?.message, {
        className: "toast-message",
      });
      router.push("/guard-gate");
    }
  }
  return (
    <div className="relative flex items-center justify-between text-sm font-regular p-4 bg-[#3d3266] sm:bg-transparent">
      <div className="header-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#3d3266"
            fillOpacity="1"
            d="M0,128L40,128C80,128,160,128,240,117.3C320,107,400,85,480,64C560,43,640,21,720,37.3C800,53,880,107,960,144C1040,181,1120,203,1200,202.7C1280,203,1360,181,1400,170.7L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className=" text-lg sm:text-2xl lowercase font-sans font-bold text-[#fff] shiny-text">
        nobi.
      </div>
      <div>
        <img src="nobi-logo.png" width={40} className=" w-6 sm:w-10"></img>
      </div>
      <div className="flex items-center cursor-pointer ">
        <p
          className="px-4 py-2 text-[#3d3266]  doodle-btn shiny-text text-sm sm:text-lg"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </div>
  );
}
