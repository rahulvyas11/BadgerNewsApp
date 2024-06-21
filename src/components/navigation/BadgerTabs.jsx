import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import BadgerNewsScreen from "../screens/BadgerNewsScreen"
import BadgerPreferencesScreen from "../screens/BadgerPreferencesScreen"
import Icon from "react-native-vector-icons/FontAwesome"

const Tab = createBottomTabNavigator()

function BadgerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="News"
        component={BadgerNewsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="newspaper-o" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Preferences"
        component={BadgerPreferencesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default BadgerTabs
