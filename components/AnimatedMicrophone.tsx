import LottieView from "lottie-react-native";

export function AnimatedMicrophone() {
    return (
        <LottieView
            source={require("../assets/animated-icons/gradientBall.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200, right: 50, bottom: 50 }}
        />
    );
}
