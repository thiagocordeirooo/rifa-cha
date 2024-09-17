import Lottie from "react-lottie";
import helloBabyData from "./hello-baby.json";

const HelloBaby = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: helloBabyData,
  };

  return <Lottie options={defaultOptions} height={200} width={200} />;
};

export default HelloBaby;
