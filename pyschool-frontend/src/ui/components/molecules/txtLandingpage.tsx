"use client";

import React from "react";
import CoverText from "../atoms/coverText";
import CoverDescriptionText from "../atoms/coverDescriptionText";
import Img from "../atoms/img";

type TxtLandingpageProps = {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
};

const TxtLandingpage: React.FC<TxtLandingpageProps> = ({
  title = "Let's learn python<br />with us",
  description = "A good software developer works with discipline and<br /> perseverance from the first day",
  imageSrc = "/images/Landingpage.png",
  imageAlt = "Python learning illustration",

}) => {
  return (
    <section
      className={`w-full flex flex-col-reverse md:flex-row items-center justify-center gap-8 px-8 py-8 bg-transparent`}
    >
      <div className="flex flex-col items-center text-center max-w-lg">
        <CoverText text={title} size="large" />
        <CoverDescriptionText text={description} size="medium" />
      </div>
      <div className="flex justify-center w-full md:w-auto">
        <Img src={imageSrc} alt={imageAlt} width={420} height={300} />
      </div>
    </section>
  );
};

export default TxtLandingpage;
