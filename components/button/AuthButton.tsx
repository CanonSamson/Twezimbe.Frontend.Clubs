import React from "react";
import Lottie from "react-lottie";
import loadingAnimationData from "../../public/assets/animations/loading.json";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
  text: string;
  handleClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  isLoading?: boolean;
  disabled?: boolean;
  loaderW?: number;
  loaderH?: number;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  disabled,
  isLoading,
  type,
  text,
  handleClick,
  className,
  loaderH = 44,
  loaderW = 44,
}) => {
  return (
    <button
      onClick={handleClick}
      type={type ? type : "button"}
      disabled={isLoading || disabled}
      className={cn(
        "disabled:cursor-not-allowed font-inter flex items-center gap-2 justify-center  px-4 h-[50px]   text-xl   font-medium bg-primary/75 text-white w-full   rounded-[10px]  duration-500 transition-all rounded-bl-none",
        className
      )}
    >
      <div
        className={` duration-500 transition-all inline-flex items-center gap-2`}
      >
        {text}

        {isLoading && (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: loadingAnimationData,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={loaderH}
            width={loaderW}
          />
        )}
      </div>
    </button>
  );
};

export default AuthButton;
