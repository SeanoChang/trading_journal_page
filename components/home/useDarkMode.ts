import { useEffect, useState } from "react";
import { RiZoomOutFill } from "react-icons/ri";

// custom hook with local storage
const useDarkMode = (): [boolean, () => void] => {
  const [theme, setTheme] = useState(false);

  const setMode = (mode: boolean) => {
    window.localStorage.setItem("theme", JSON.stringify(mode));
    setTheme(mode);
  };

  const toggleTheme = () => {
    setMode(!theme);
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    // if local storage has a theme, set it
    if (localTheme) {
      setTheme(JSON.parse(localTheme));
    }
  }, []);

  return [theme, toggleTheme];
};

export default useDarkMode;
