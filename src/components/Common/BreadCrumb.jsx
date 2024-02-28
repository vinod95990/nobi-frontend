import { useRouter } from "next/navigation";

export default function BreadCrumb(props) {
  const { parentData = null, current } = props;
  const router = useRouter();
  function handleNavigation(to) {
    router.push(to);
  }
  //agar koi parent nhi bheja humne toh show just a home icon
  if (!parentData) {
    return (
      <div className="flex  w-9/12 gap-3 my-1 mb-7 items-center py-2">
        <img
          className="cursor-pointer"
          width={32}
          height={32}
          src="/icons/home.png"
          onClick={() => handleNavigation("/")}
        ></img>
      </div>
    );
  }

  return (
    <div
      className="flex w-9/12 gap-3 my-1 mb-7 items-center overflow-x-auto py-2"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#7152E1 transparent",
      }}
    >
      <img
        className="cursor-pointer"
        width={32}
        height={32}
        src="/icons/home.png"
        onClick={() => handleNavigation("/")}
      ></img>
      {parentData?.map((data, index) => {
        return (
          <>
            <img width={30} height={30} src="/icons/direction-arrow.png"></img>
            <p
              key={data._id}
              className={`text-lg ${
                parentData.length == index + 1
                  ? "text-[#7152E1]"
                  : "text-[#16171c]"
              } cursor-pointer`}
              onClick={() => handleNavigation(`/${data._id}`)}
              style={{ whiteSpace: "nowrap" }}
            >
              {data.name}
            </p>
          </>
        );
      })}
    </div>
  );
}
