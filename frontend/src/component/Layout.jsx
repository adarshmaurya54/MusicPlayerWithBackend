import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ThemeProvider } from '../context/theme'

function Layout() {

    const [themeMode, setThemeMode] = useState(localStorage.getItem("theme"));
    // Functions of enabling lightmode and darkmode
    const lightTheme = () => {
        setThemeMode("light");
    };
    const darkTheme = () => {
        setThemeMode("dark");
    };
    // actual change in theme..
    useEffect(() => {
        document.querySelector("html").classList.remove("light", "dark");
        document.querySelector("html").classList.add(themeMode);

        // Find the meta tag with name="theme-color"
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');

        // If it doesn't exist, create it
        if (!metaThemeColor) {
            metaThemeColor = document.createElement("meta");
            metaThemeColor.name = "theme-color";
            document.head.appendChild(metaThemeColor);
        }

        // Update the content attribute with the new color
        metaThemeColor.content = themeMode === "light" ? "#ffffff" : "#0f172a";

        // storing theme state in localstorage
        localStorage.setItem("theme", themeMode);
    }, [themeMode]);
    return (
        <ThemeProvider value={{ lightTheme, darkTheme, themeMode }}>
            <div className="md:bg-black/20 transition-all duration-500">
                <div
                    className={`h-screen md:px-10  bg-fixed overflow-auto bg-center bg-cover transition-all duration-500 bg-[url('/src/assets/Blur.png')] dark:bg-[url('/src/assets/bg_dark.jpg')]`}
                >
                    <Outlet />
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Layout
