import Lottie from "react-lottie";
import loadingSpinnerData from "./loading-spinner.json";

const LoadingSpinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingSpinnerData,
  };

  return <Lottie options={defaultOptions} height={200} width={200} />;
};

export default LoadingSpinner;
