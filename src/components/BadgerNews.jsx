import React from "react"
import BadgerTabs from "./navigation/BadgerTabs"
import { NavigationContainer } from "@react-navigation/native"
import { PreferencesProvider } from "./screens/PreferencesContext"

export default function BadgerNews(props) {
  return (
    <PreferencesProvider>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
    </PreferencesProvider>
  )
}
