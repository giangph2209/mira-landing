"use client";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EllipsisIcon } from "@/components/icons/ellipsis-icon";
import useScroll from "@/hooks/use-scroll";
import { ArrowUp } from 'lucide-react'

function Hotline() {
  const [open, setOpen] = useState(false);

  const { isVisible } = useScroll();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  const renderScrollToTopButton = () => {
    if (!isVisible) return null

    return (
      <button
        type="button"
        onClick={handleClick}
        className="fixed bottom-6 cursor-pointer right-6 z-50 flex size-[50px] items-center justify-center rounded-full bg-gradient-to-r from-[#6BF2C6] to-[#279AE7] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-200"
        aria-label="Cuộn lên đầu trang"
      >
        <ArrowUp size={20} />
      </button>
    )
  }

  return (
    <>
      {renderScrollToTopButton()}
      <div
        className={`fixed right-6 z-999  ${isVisible ? "bottom-[85px]" : "bottom-6"} transition-all duration-300`}
      >
        <div
          ref={containerRef}
          className="relative z-100"
        >
          <button
            aria-label="Open hotline actions"
            onClick={() => setOpen((prev) => !prev)}
            className="max-lg:flex hidden size-[50px] rounded-full items-center justify-center bg-gray-200 border shadow-sm border-gray-300 hover:scale-105 transition-all duration-300"
          >
            <EllipsisIcon width={24} height={24} />
          </button>

          <div
            className={clsx(
              "flex flex-col gap-4",
              "lg:static max-lg:absolute max-lg:right-0 max-lg:bottom-[calc(100%+12px)] max-lg:origin-bottom-right max-lg:transition-all max-lg:duration-300",
              open
                ? "max-lg:opacity-100 max-lg:scale-100 max-lg:pointer-events-auto"
                : "max-lg:opacity-0 max-lg:scale-95 max-lg:pointer-events-none",
            )}
          >
            <a
              aria-label="Facebook"
              target="_blank"
              href="https://www.facebook.com/dcsoftware.vn/"
              className="size-[50px] rounded-full shadow-sm flex items-center justify-center cursor-pointer relative overflow-visible hover:scale-105 transition-all duration-300"
            >
              <span className="absolute inline-flex h-[75%] w-[75%] animate-ping rounded-full bg-blue-400 opacity-50"></span>
              <Image
                src={"/images/contact/facebook.png"}
                alt="facebook"
                width={50}
                height={50}
                sizes="50px"
                className="absolute size-[50px] object-contain"
              />
            </a>
            <a
              aria-label="Zalo OA"
              href="https://zalo.me/3829922982069770498"
              target="_blank"
              className={clsx(
                // "border border-neu-200 bg-neu-50",
                "size-[50px] rounded-full shadow-sm flex items-center justify-center relative overflow-visible hover:scale-105 transition-all duration-300",
                "cursor-pointer group",
              )}
            >
              <span className="absolute inline-flex h-[75%] w-[75%] animate-ping rounded-full bg-blue-600 opacity-50"></span>
              <Image
                src={"/images/contact/zalo.png"}
                alt="zalo"
                width={50}
                height={50}
                sizes="50px"
                className="absolute size-[50px] object-contain"
              />
            </a>
            <a
              aria-label="Hotline"
              href={"tel:+84349964332"}
              className={clsx(
                "size-[50px] rounded-full animation-ping shadow-sm flex items-center justify-center relative overflow-visible hover:scale-105 transition-all duration-300",
                "cursor-pointer group",
              )}
            >
              <span className="absolute inline-flex h-[75%] w-[75%] animate-ping rounded-full bg-green-400 opacity-50"></span>
              {/* <span className="relative inline-flex size-[50px] rounded-full bg-sky-500"></span> */}
              <Image
                src={"/images/contact/call.png"}
                alt="call"
                width={50}
                height={50}
                sizes="50px"
                className="absolute size-[50px] object-contain"
              />
            </a>
          </div>
        </div>
      </div >
    </>

  );
}

export default Hotline;