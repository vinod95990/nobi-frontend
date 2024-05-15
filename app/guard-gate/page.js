"use client";

// import PortraitAnimation from "@/src/components/Common/PortraitAnimation";
import Signup from "@/src/components/Signup/Signup";
import withAuthAccessLoginPage from "@/src/hoc/withAccessLoginPage";
import Image from "next/image";
function SignupHome() {
  return (
    <div className="h-full">
      {/* <div
        className=" sm:flex items-center justify-center hidden"
        style={{
          position: "relative",
          background: "#16171c",
        }}
      >
        <PortraitAnimation />
      </div> */}

      {/* FORM */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-0 w-[75%] sm:w-[45%] lg:w-[35%]">
        <Signup />
      </div>

      <Image
        className="w-36 sm:w-44 fixed top-8 -left-16 -z-10 neuShadow-sheep-stack   rotate-[40deg]"
        src="/floats/f17.jpg"
        alt="cards"
        width={144}
        height={144}
        loading="lazy"
      ></Image>
      <Image
        className="w-36 sm:w-44 fixed -bottom-16 left-0 sm:left-32 -z-10 neuShadow-orange-cat-girl  rotate-[30deg]"
        src="/floats/f9.jpg"
        alt="cards"
        width={144}
        height={144}
        loading="lazy"
      ></Image>

      <Image
        className="w-36 sm:w-44 fixed bottom-44 -right-20 -z-10 neuShadow-pink-bear  -rotate-45"
        src="/floats/f21.jpg"
        alt="cards"
        width={144}
        height={144}
        loading="lazy"
      ></Image>

      <Image
        className="w-40 sm:w-48 fixed -bottom-24 right-0 sm:right-96 -z-10 neuShadow-vibrant-animals -rotate-3"
        src="/floats/f12.jpg"
        width={160}
        height={160}
        alt="cards"
        loading="lazy"
      ></Image>

      <Image
        className="w-36 hidden sm:block sm:w-44 fixed -top-14 right-44 -z-10 neuShadow-totoro-sticker-card  -rotate-[200deg]"
        src="/floats/f20.jpg"
        alt="cards"
        width={144}
        height={144}
        loading="lazy"
      ></Image>

      <Image
        className="w-36 sm:w-44 fixed -top-52 left-72 -z-10 neuShadow-tiger  -rotate-[180deg]"
        src="/floats/f14.jpg"
        alt="cards"
        width={144}
        height={144}
        loading="lazy"
      ></Image>
    </div>
  );
}

export default withAuthAccessLoginPage(SignupHome);
