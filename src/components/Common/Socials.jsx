import { GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";
import Image from "next/image";

export default function Socials(props) {
  const { isLoading } = props;
  const linkToIconMap = [
    {
      key: "github",
      href: "https://github.com/vinod95990",
      image: GithubLogo,
    },
    {
      key: "linkedin",
      href: "https://www.linkedin.com/in/vinod-m-345a701b6/",
      image: LinkedinLogo,
    },
    {
      key: "twitter",
      href: "https://twitter.com/mystic_ezra",
      image: XLogo,
    },
  ];
  return (
    <div className="bg-white flex sm:flex-col items-center gap-5 justify-center sm:ml-auto  pb-2 sm:p-0 sm:bottom-0 sm:right-4 sm:transform-none   sm:fixed z-50">
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
              className=" transition-all "
            >
              {
                <data.image
                  size={32}
                  color="#0b1215"
                  className="hover:border-2 hover:border-[#0b1215] hover:p-1  transition-all hover:rounded-md"
                />
              }
            </a>
          );
        })
      )}
      <p className="h-16  hidden sm:block w-1 bg-[#0b1215]"></p>
    </div>
  );
}
