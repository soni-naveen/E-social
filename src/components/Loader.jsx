import Lottie from "lottie-react";
import loadingAnimation from "../animations/LoadAnimation.json";

const Loader = () => {
  return (
    <div className="-mt-32 sm:-mt-28">
      <Lottie animationData={loadingAnimation} />
    </div>
  );
};

export default Loader;
