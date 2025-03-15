import React from "react";
import Section from "./section";
import { socials } from "../../constants";
import Link from "next/link";
import Image from "next/image";

type Props = {};

const Footer = (props: Props) => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container flex flex-col items-center gap-6">
        <ul className="flex flex-wrap gap-5">
          {socials.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              className="flex size-10 items-center justify-center rounded-full bg-n-7 transition-colors hover:bg-n-6"
            >
              <Image src={item.iconUrl} width={16} height={16} alt={item.title} />
            </Link>
          ))}
        </ul>
        <div className="text-center">
          <p className="text-sm text-slate-400 opacity-60">
            Contribution by{" "}
            <Link
              href="https://www.linkedin.com/in/bhanuprakashchowdam"
              target="_blank"
              className="hover:text-[#4A00E0] text-slate-400 underline transition-colors duration-200"
            >
              Bhanu Prakash Chowdam{" "}
            </Link>
            <br />
            <Link
              href="https://www.linkedin.com/in/vaishnavimangati"
              target="_blank"
              className="hover:text-[#4A00E0] text-slate-500  underline transition-colors duration-200"
            >
              & Mangati Vaishnavi
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
};

export default Footer;
