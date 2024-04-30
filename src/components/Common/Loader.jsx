import "./Loader.css";

export default function Loader() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <img
        src="gifs/pix3.gif"
        className="cursor-pointer w-16 xl:w-24 lg:w-20"
      ></img>
    </div>
    // <div className="lds-ellipsis">
    //   <div></div>
    //   <div></div>
    //   <div></div>
    //   <div></div>
    // </div>
  );
}
