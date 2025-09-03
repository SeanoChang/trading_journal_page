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
      try {
        const parsed = JSON.parse(localTheme);
        setTheme(!!parsed);
      } catch {
        const normalized = localTheme.replace(/"/g, "").toLowerCase();
        if (normalized === "dark" || normalized === "true") setTheme(true);
        else if (normalized === "light" || normalized === "false")
          setTheme(false);
      }
    }
  }, []);

  return [theme, toggleTheme];
};

export default useDarkMode;
