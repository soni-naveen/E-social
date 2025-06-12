import Lottie from "lottie-react";
import loadingAnimation from "../animations/LoadAnimation.json";

const Loader = () => {
  return (
    <div className="-mt-5">
      <Lottie animationData={loadingAnimation} />
    </div>
  );
};

export default Loader;
