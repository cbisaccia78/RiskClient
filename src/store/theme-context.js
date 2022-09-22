import React, {useState} from 'react'

const ThemeContext = React.createContext({
    currentTheme: "light"
})


export function ThemeContextProvider(props){
    const [currentTheme, setCurrentTheme] = useState("light")
    return (
        <ThemeContext.Provider value={{currentTheme: currentTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext