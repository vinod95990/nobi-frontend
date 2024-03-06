export default function Socials(props) {
  const { isLoading } = props;
  const linkToIconMap = [
    {
      key: "github",
      href: "https://github.com/vinod95990",
      src: "../../icons/github-logo-fill.svg",
    },
    {
      key: "linkedin",
      href: "https://www.linkedin.com/in/vinod-m-345a701b6/",
      src: "../../icons/linkedin-logo-fill.svg",
    },
    {
      key: "twitter",
      href: "https://twitter.com/TricksArena1",
      src: "../../icons/twitter-logo-fill.svg",
    },
  ];
  return (
    <div className="absolute w-fit bottom-0 left-1/2 transform -translate-x-1/2 flex sm:flex-col items-center gap-5 justify-center sm:ml-auto  pb-2 sm:p-0 sm:bottom-0 sm:right-4 sm:transform-none   sm:fixed">
      {isLoading ? (
        <></>
      ) : (
        linkToIconMap.map((data) => {
          return (
            <a
              key={data.key}
              href={data.href}
              target="_blank"
              rel="noopener noreferrer"
              className=" cursor-pointer hover:border-y-4 transition-colors"
            >
              <img width={30} className="max-w-full" src={data.src}></img>
            </a>
          );
        })
      )}
      <p className="h-16  hidden sm:block w-1 bg-[#3d3266]"></p>
    </div>
  );
}
