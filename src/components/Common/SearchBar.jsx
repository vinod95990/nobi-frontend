import "./SearchBar.css";

export default function SearchBar(props) {
  const { handleSearchClick, handleSearchedStringChange, searchedString } =
    props;
  return (
    <div
      className="flex items-center justify-center p-4 py-8 "
      style={{
        width: "100%",
      }}
    >
      <div className="flex items-center justify-center flex-col gap-3 text-3xl w-full ">
        <h1 className="text-[#3d3266] shiny-text">What are you looking at?</h1>
        <div
          className=" text-[#f4f5f0] p-1 rounded-full flex items-center justify-between text-sm search-box"
          style={{
            width: "50%",
            position: "relative",
            zIndex: "2",
          }}
        >
          <input
            type="text"
            className="w-full p-3 font-sans tracking-wider	text-[#16171c] font-bold gradient-css "
            onChange={handleSearchedStringChange}
            // value={searchedString}
            placeholder="I'll check through everything you have"
            style={{
              background: "transparent",
              outline: "none",
            }}
          ></input>
          <div
            className="cursor-pointer px-6 py-2 rounded-3xl   shiny-text bg-[#3d3266]  border-2 border-[#3d3266] hover:bg-[#7152e1]  text-[#f4f5f0] transition-colors"
            onClick={(e) => handleSearchClick(e)}
          >
            Search
          </div>
        </div>
      </div>
    </div>
  );
}
