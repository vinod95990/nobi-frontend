"use client";
import React, { useState, useEffect } from "react";

const animations = [
  {
    content: (
      <div
        className="text-xl text-white flex flex-col items-center tame-jungle"
        key="tame-jungle"
      >
        <div
          className="flex items-center gap-3"
          style={{
            textShadow:
              " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
          }}
        >
          <span className="tame-jungle-0">Tame</span>
          <span className="tame-jungle-1">Your</span>
          <span
            className="text-3xl text-blue-500	font-bold tame-jungle-2"
            style={{
              textShadow:
                " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            }}
          >
            Link
          </span>
        </div>
        <div
          className="flex items-center justify-center gap-4"
          style={{
            textShadow:
              " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
          }}
        >
          <span className="text-5xl font-bold text-green-400 tame-jungle-3">
            Jungle
          </span>
          <div
            className="flex flex-col items-center justify-center "
            style={{
              textShadow:
                " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            }}
          >
            <span className="tame-jungle-4">Embrace</span>
            <span className="tame-jungle-5">The</span>
          </div>
        </div>
        <div
          className="flex items-center  gap-4"
          style={{
            textShadow:
              " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
          }}
        >
          <p className="text-7xl font-bold text-[#f4f5f0]	tame-jungle-6">
            nobi.
          </p>

          <p className="tame-jungle-7">Magic</p>
        </div>
      </div>
    ),
    timeItTakes: 16000,
  },
  {
    content: (
      <div className="folder-structure-container">
        <div className="sparkle-1">✨</div>
        <div className="sparkle-2">✨</div>
        <div className="sparkle-3">✨</div>
        <div className="sparkle-4">✨</div>
        <div className="sparkle-5">✨</div>
        <div className="sparkle-5">✨</div>
        <div className="sparkle-6">✨</div>
        <div className="sparkle-7">✨</div>
        <div className="sparkle-8">✨</div>

        <div
          className="flex items-center justify-center"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: "12 !important",
            fontSize: "26px",
          }}
        >
          <div
            className="nobi-container"
            style={{
              textShadow:
                " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            }}
          >
            <div>nobi.</div>
          </div>
        </div>

        <div
          className="grid grid-cols-2 grid-rows-2 w-80 h-80"
          style={{
            textShadow:
              " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
          }}
        >
          <div
            className=""
            style={{
              position: "relative",
              zIndex: -1,
            }}
          >
            <div
              className="doodle folder-react"
              style={{
                position: "absolute",
                top: "-10px",
                right: "0",
              }}
            >
              <p>Pokemon</p>
            </div>
            <div
              className="doodle folder-react-child-1"
              style={{
                position: "absolute",
                bottom: "0px",
                right: "-40px",
              }}
            >
              <p>Water</p>
            </div>
          </div>
          {/* -------2------ */}

          <div
            className=""
            style={{
              position: "relative",
            }}
          >
            <div
              className="doodle folder-react-child-2"
              style={{
                position: "absolute",
                top: "5px",
                right: "-10px",
              }}
            >
              <p>Grass</p>
            </div>
            <div
              className="doodle folder-react-child-1-1"
              style={{
                position: "absolute",
                bottom: "2.5%",
                right: "0px",
              }}
            >
              <p>Gogoat</p>
            </div>
          </div>
          {/* ----- */}

          <div
            className=""
            style={{
              position: "relative",
            }}
          >
            <div
              className="doodle folder-react-child-2-2-1"
              style={{
                position: "absolute",
                bottom: "2%",
                left: "0",
              }}
            >
              <p>Evolutions</p>
            </div>
            <div
              className="doodle folder-react-child-2-1"
              style={{
                position: "absolute",
                top: "40%",
                right: "-10px",
              }}
            >
              <p>Greninja</p>
            </div>
          </div>
          {/* ----- */}
          <div style={{}}></div>
        </div>
      </div>
    ),
    timeItTakes: 25000,
  },

  {
    content: (
      <div className="text-white text-2xl text-wrap scatter-star">
        <div className="text-3xl ">
          <span className="flex items-center gap-3 justify-center ">
            <span className="scatter-star-0">From </span>{" "}
            <span className=" text-3xl scatter-star-1">Scattered</span>
          </span>
          <span className="flex items-center gap-3 justify-center">
            <span
              className="text-lime-300 text-5xl scatter-star-2 font-bold"
              style={{
                textShadow:
                  " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
              }}
            >
              Stars
            </span>
            <span className="scatter-star-3 text-2xl">To a</span>
          </span>
          <div
            className="text-blue-400	 text-4xl text-center scatter-star-4"
            style={{
              textShadow:
                " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            }}
          >
            Personalised
          </div>
          <div
            className="text-teal-100	 text-5xl scatter-star-5 font-bold"
            style={{
              textShadow:
                " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            }}
          >
            Constellation
          </div>
        </div>
      </div>
    ),
    timeItTakes: 16000,
  },
  {
    content: (
      <div className="relative">
        <h1
          className="text-white text-5xl one-problem"
          style={{
            textShadow:
              " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
          }}
        >
          Life Problems.
        </h1>
        <div
          className="bookmark-div flex items-center justify-center flex-col flex-wrap"
          style={{
            width: "300px",
          }}
        >
          <p
            className="text-5xl text-white font-bolder pb-4 text-center"
            style={{
              textShadow:
                " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            }}
          >
            Briyani with Elaichi.
          </p>
        </div>

        <div className="bookmark-div-0">
          <div className="flex items-center justify-center gap-4 pb-4">
            <p className="text-5xl text-sky-400 text-end">😊</p>
            <p
              className="text-5xl font-bolder text-cyan-500"
              style={{
                textShadow:
                  " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
              }}
            >
              Bookmarks.
            </p>
          </div>

          <div className="flex gap-2 items-center  text-white justify-between border-2 p-4 rounded-lg my-3 flex-wrap">
            <div className="">📂 interview</div>
            <div>📂 email</div>
            <div>📂 pokemon</div>
          </div>
        </div>

        <div className="bookmark-div-1">
          <div className="flex items-center justify-center gap-4 pb-4 ">
            <p className="text-5xl text-sky-400 text-end">🙂</p>
            <p
              className="text-5xl font-bolder text-cyan-600"
              style={{
                textShadow:
                  " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
              }}
            >
              more Bookmarks.
            </p>
          </div>

          <div className="flex gap-2 items-center  text-white justify-between border-2 p-4 rounded-lg my-3 flex-wrap">
            <div className="">📂 interview</div>
            <div>📂 email</div>
            <div>📂 pokemon</div>
            <div>🔗 https://...</div>
            <div>📂 docs</div>
            <div>🔗 https://...</div>
          </div>
        </div>

        <div className="bookmark-div-2">
          <div className="flex items-center justify-center gap-4 ">
            <p
              className="text-5xl text-sky-400 text-end"
              style={{
                textShadow:
                  " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
              }}
            >
              😭
            </p>
            <p
              className="text-2xl text-white font-bolder pb-4"
              style={{
                width: "240px",
                textShadow:
                  " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
              }}
            >
              <span className="text-lime-400">Lost</span> where the link was...
            </p>
          </div>

          <div className="flex gap-2 items-center  text-white justify-between border-2 p-4 rounded-lg my-3 flex-wrap">
            <div className="">📂 interview</div>
            <div>📂 email</div>
            <div>📂 pokemon</div>
            <div>🔗 https://</div>
            <div>📂 docs</div>
            <div>🔗 https://</div>
            <div>🔗 https://</div>
            <div>📂 internals</div>
            <div>🔗 https://</div>
          </div>
        </div>

        <div
          className="bookmark-div-3 flex items-center justify-center flex-col flex-wrap"
          style={{
            width: "350px",
          }}
        >
          <p
            className="text-5xl text-white font-bolder pb-4"
            style={{
              textShadow:
                " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            }}
          >
            One Solution.
          </p>
        </div>

        <div
          className="text-5xl text-white nobi-div"
          style={{
            textShadow:
              " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
          }}
        >
          <h1 className="font-bold	">nobi.</h1>
        </div>
      </div>
    ),
    timeItTakes: 35000,
  },
  {
    content: (
      <div className="ditch-the-clutter text-white text-2xl">
        <p className="text-gray-400">
          <span className="ditch-the-clutter-0">
            <span className="text-4xl text-blue-500">Ditch</span> The{" "}
          </span>
          <span className="text-6xl  text-rose-400 ditch-the-clutter-1 font-bold">
            Clutter
          </span>
        </p>
        <h1 className="text-gray-200 flex items-center gap-3">
          <span
            className="text-7xl text-[#f4f5f0] text-bold ditch-the-clutter-2 font-bold"
            style={{
              textShadow:
                " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            }}
          >
            nobi.
          </span>{" "}
          <span
            className="ditch-the-clutter-3"
            // style={{
            //   textShadow:
            //     " 0 0 7px rgba(255,255,255,.3), 0 0 3px rgba(255,255,255,.3)",
            // }}
          >
            Your Stuff
          </span>
        </h1>
      </div>
    ),
    timeItTakes: 12000,
  },
];

export default function PortraitAnimation() {
  const [currentDivIndex, setCurrentDivIndex] = useState(0);

  useEffect(() => {
    let timeoutId;
    const handleTimeout = () => {
      const updatedIndex = (currentDivIndex + 1) % animations.length;

      setCurrentDivIndex(updatedIndex);
    };

    // Start with the first delay
    timeoutId = setTimeout(
      handleTimeout,
      animations[currentDivIndex].timeItTakes
    );

    return () => clearTimeout(timeoutId);
  }, [currentDivIndex]);

  return animations[currentDivIndex].content;
}
