import PortraitAnimation from "@/src/components/Common/PortraitAnimation";
import Signup from "@/src/components/Signup/Signup";
import AccessAuthPage from "@/src/hoc/AccessAuthPage";
export default function SignupHome() {
  // const router = useRouter();
  return (
    <AccessAuthPage>
      <div
        className="grid w-40 grid-cols-2 h-fit"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          className=" flex items-center justify-center "
          style={{
            position: "relative",
            background: "#16171c",
          }}
        >
          <PortraitAnimation />
        </div>

        {/* FORM */}
        <div className="flex items-center justify-center doodle-img-container bg-[#16171c]">
          <Signup />
        </div>
      </div>
    </AccessAuthPage>
  );
}
