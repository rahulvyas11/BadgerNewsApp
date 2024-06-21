import React, { createContext, useState, useEffect, useContext } from "react"

const PreferencesContext = createContext(true)
export const PreferencesProvider = ({ children }) => {
  const [prefs, setPrefs] = useState({})

  useEffect(() => {
    fetch("https://cs571.org/api/f23/hw8/articles", {
      headers: {
        "X-CS571-ID":
          "bid_8de1afeb832f02dbab913e76b98a6023d9936230d9545eea701bb48fc2f36a2e",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const uniqueTags = Array.from(
          new Set(data.flatMap((article) => article.tags))
        )
        const defaultPrefs = {}
        uniqueTags.forEach((tag) => {
          defaultPrefs[tag] = true
        })
        setPrefs(defaultPrefs)
      })
      .catch((error) => console.error("Error fetching tags:", error))
  }, [])
  const updatePreference = (tag, value) => {
    setPrefs((prevPrefs) => ({ ...prevPrefs, [tag]: value }))
  }

  return (
    <PreferencesContext.Provider value={{ prefs, updatePreference }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const UserPreferences = () => {
  const userContext = useContext(PreferencesContext)
  if (!userContext) {
    throw new Error("usePreferences should be within PreferencesProvider")
  }
  return userContext
}
