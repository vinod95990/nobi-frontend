import "./SearchBar.css";

export default function SearchBar(props) {
  const { handleSearchClick, handleSearchedStringChange } = props;
  return (
    <div
      className="flex items-center justify-center p-4 py-8 "
      style={{
        width: "100%",
      }}
    >
      <div className="flex items-center justify-center flex-col gap-3 w-full ">
        <h1 className="text-[#3d3266] shiny-text text-lg sm:text-3xl ">
          Discover your treasures
        </h1>
        <div
          className=" text-[#f4f5f0] relative p-1 z-10 w-3/4 sm:w-1/2 rounded-full flex items-center justify-between text-sm search-box"
          // style={{
          //   width: "50%",
          //   position: "relative",
          //   zIndex: "2",
          //   padding: "4px",
          // }}
        >
          <input
            type="text"
            className="w-full p-3 font-sans tracking-wider	text-[#3d3266] font-bold gradient-css "
            onChange={handleSearchedStringChange}
            // value={searchedString}
            placeholder="Seek answers in the whispers of time..."
            style={{
              background: "transparent",
              outline: "none",
            }}
          ></input>
          <div
            className="cursor-pointer px-6 py-2 rounded-3xl   shiny-text bg-[#060708]  border-2 border-[#060708] hover:bg-[#3d3266]  text-[#f2f2f2] transition-colors hidden sm:block"
            onClick={(e) => handleSearchClick(e)}
          >
            Search
          </div>
        </div>
      </div>
    </div>
  );
}
