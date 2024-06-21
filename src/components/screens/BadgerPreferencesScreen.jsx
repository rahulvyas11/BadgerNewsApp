import React, { useEffect, useState } from "react"
import { Text, View, Switch, StyleSheet, TouchableOpacity } from "react-native"
import { UserPreferences } from "./PreferencesContext"

const BadgerPreferencesScreen = () => {
  const { prefs, updatePreference } = UserPreferences()
  const [allTags, setAllTags] = useState([])

  useEffect(() => {
    fetchArticleTags()
  }, [])

  const fetchArticleTags = async () => {
    try {
      const response = await fetch("https://cs571.org/api/f23/hw8/articles", {
        headers: {
          "X-CS571-ID":
            "bid_8de1afeb832f02dbab913e76b98a6023d9936230d9545eea701bb48fc2f36a2e",
        },
      })
      const data = await response.json()
      const uniqueTags = Array.from(
        new Set(data.flatMap((article) => article.tags))
      )
      setAllTags(uniqueTags)
    } catch (error) {
      console.error("Error fetching tags:", error)
    }
  }

  return (
    <View style={styles.container}>
      {allTags.map((tag) => (
        <PreferenceCard
          key={tag}
          tag={tag}
          value={prefs[tag]}
          onToggle={updatePreference}
        />
      ))}
    </View>
  )
}

const PreferenceCard = ({ tag, value, onToggle }) => (
  <TouchableOpacity style={styles.card} onPress={() => onToggle(tag, !value)}>
    <Text>{tag}</Text>
    <Switch
      value={value}
      onValueChange={() => onToggle(tag, !value)}
      thumbColor={value ? "white" : "grey"}
      trackColor={{ false: "white", true: "red" }}
    />
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    elevation: 8,
    borderColor: "#fff",
    padding: 16,
    marginBottom: 16,
  },
})

export default BadgerPreferencesScreen
