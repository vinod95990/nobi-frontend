"use client";
import { useSelector } from "react-redux";

export default function NobiError() {
  const nobiError = useSelector((state) => {
    return state.nobiError;
  });

  return <div></div>;
}
