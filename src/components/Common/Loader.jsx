import Image from "next/image";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <Image
        src="/gifs/pix3.gif"
        alt="loading"
        width={64}
        height={64}
        className="cursor-pointer w-16 xl:w-24 lg:w-20"
      ></Image>
    </div>
    // <div className="lds-ellipsis">
    //   <div></div>
    //   <div></div>
    //   <div></div>
    //   <div></div>
    // </div>
  );
}
