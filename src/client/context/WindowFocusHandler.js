import React, { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export default function WindowFocusHandler(props) {
    let { isFocused, setFocus } = useContext(UserContext);

    var onFocus = () =>{
        setFocus(true);
    }
    
    var onBlur = () =>{
        setFocus(false);
    }

    useEffect(() => {
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur)
        // Specify how to clean up after this effect:
        return () => {
        window.removeEventListener("focus", onFocus);
        window.removeEventListener("blur", onBlur);
        };
    },[isFocused,setFocus]);

  return <></>;
}
