import React from "react";
import Section from "@/components/layout/section";
import { collabApps, collabContent, collabText, images } from "@/constants";
import Image from "next/image";
import Button from "@/components/atoms/button";
import { cn } from "@/lib/utils";
import { LeftCurve, RightCurve } from "@/components/design/collaboration";
import Link from "next/link";
type Props = {};

const Collaboration = (props: Props) => {
  return (
    <Section id="about" crosses>
      <div className="container lg:flex">
        <div className="max-w-[25rem] max-sm:pl-4">
          <h2 className="h2 mb-12 max-md:mb-4">Cynosure a Fest of Innovation and Fun!</h2>
          <ul className="mb-10 max-w-[22rem] md:mb-14">
            {collabContent.map((item) => (
              <li key={item.id} className="mb-3 py-3">
                <div className="flex items-center">
                  <Image src={images.check} width={24} height={24} alt="check" />
                  <h6 className="body-2 ml-5">{item.title}</h6>
                </div>
                {item.text && (
                  <p className="body-2 mt-3 hidden text-slate-300 max-sm:px-10">{item.text}</p>
                )}
              </li>
            ))}
          </ul>
          <Button href="/" white className="animate-fade-up opacity-30 cursor-not-allowed ">
            Registration closed
          </Button>
        </div>

        <div className="mt-4 lg:ml-auto xl:w-[38rem]">
          <p className=" body-2 mb-8 text-n-4 max-sm:hidden md:mb-16 lg:mx-auto lg:mb-32 lg:w-[22rem]">
            {collabText}
          </p>

          <div className="relative max-sm:hidden left-1/2 flex aspect-square w-[22rem] -translate-x-1/2 scale-75 rounded-full border border-n-6 md:scale-100">
            <div className="m-auto flex aspect-square w-60 rounded-full border border-n-6">
              <div className="m-auto aspect-square w-24 rounded-full bg-conic-gradient p-[0.2rem]">
                <div className="flex h-full items-center justify-center rounded-full bg-n-8">
                  <Image src={images.brainwaveSymbol} width={48} height={48} alt="brainwave" />
                </div>
              </div>
            </div>

            <ul>
              {collabApps.map((item, index) => (
                <li
                  key={item.id}
                  className={cn(
                    "absolute left-1/2 top-0 -ml-[1.6rem] h-1/2 origin-bottom",
                    `rotate-${index * 45}`
                  )}
                >
                  <div
                    className={cn(
                      "relative -top-[1.6rem] flex w-[3.2rem] h-[3.2rem] bg-n-7 border border-n-1/15 rounded-xl",
                      `-rotate-${index * 45}`
                    )}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={36}
                      height={36}
                      className="m-auto"
                    />
                  </div>
                </li>
              ))}
            </ul>

            <LeftCurve />
            <RightCurve />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Collaboration;
