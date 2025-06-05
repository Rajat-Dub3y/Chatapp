import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    Theme: localStorage.getItem("chatapp-theme") || "coffee",
    setTheme:(theme)=>{
        localStorage.setItem("chatapp-theme",theme)
        set({theme})
    }
}))

