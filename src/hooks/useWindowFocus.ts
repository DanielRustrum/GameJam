import { useEffect, useState } from "react"

export const useWindowFocus = () => {
    const [is_focused, setIsFocused] = useState(true)
  
    useEffect(() => {
      const handleFocus = () => setIsFocused(true)
      const handleBlur = () => setIsFocused(false)
  
      window.addEventListener('focus', handleFocus)
      window.addEventListener('blur', handleBlur)
  
      return () => {
        window.removeEventListener('focus', handleFocus)
        window.removeEventListener('blur', handleBlur)
      }
    }, [])
  
    return is_focused
}