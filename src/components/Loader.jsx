import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../animations/LoadAnimation.json";

const Loader = () => {
  return (
    <Lottie
      animationData={loadingAnimation}
      className="md:h-60 md:w-60 h-72 w-72"
    />
  );
};

export default Loader;
