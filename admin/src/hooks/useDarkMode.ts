import { useEffect } from "react";
import { isNil } from "lodash";
import { isDarkState } from "../store/isDark";

const useDarkMode = (): {
  isDark: boolean;
  onClickToggleButton: () => void;
} => {
  const { isDark, setIsDark } = isDarkState((state) => state);

  useEffect(() => {
    setIsDark(getTheme());
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      return;
    }

    document.documentElement.classList.remove("dark");
    document.body.classList.remove("dark");
  }, [isDark]);

  const getTheme = () => {
    if (isNil(localStorage.theme)) {
      return false;
    }

    return (
      localStorage.theme === "dark" || !window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  };

  const onClickToggleButton = () => {
    const updateMode = !isDark;

    if (updateMode) {
      localStorage.theme = "dark";
    } else {
      localStorage.theme = "light";
    }

    setIsDark(updateMode);
  };

  return { isDark, onClickToggleButton };
};

export default useDarkMode;
