import React, { useState, useEffect, useRef } from "react"
import {
  Pressable,
  Animated,
  Text,
  View,
  Image,
  Linking,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import BadgerNewsItemCard from "../NewsCard"
import { MaterialIcons } from "@expo/vector-icons"
import { UserPreferences } from "./PreferencesContext"

const BadgerNewsScreen = () => {
  const navigation = useNavigation()
  const [articles, setArticles] = useState([])
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fadeInAnim = useRef(new Animated.Value(0)).current
  const { prefs, updatePreference } = UserPreferences()

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    updateNavigationOptions()
    handleArticleSelection()
  }, [selectedArticle])

  const fetchArticles = async () => {
    try {
      const response = await fetch("https://cs571.org/api/f23/hw8/articles", {
        headers: {
          "X-CS571-ID":
            "bid_8de1afeb832f02dbab913e76b98a6023d9936230d9545eea701bb48fc2f36a2e",
        },
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setArticles(data)
      } else {
        console.error("Invalid data format:", data)
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
    }
  }

  const updateNavigationOptions = () => {
    navigation.setOptions({
      headerTitle: selectedArticle ? "Article" : "Articles",
      headerLeft: () =>
        selectedArticle ? (
          <TouchableOpacity onPress={() => setSelectedArticle(null)}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        ) : null,
    })
  }

  const handleArticleSelection = () => {
    if (selectedArticle) {
      fadeInAnim.setValue(0)
      setIsLoading(false)
      preloadImage()
    }
  }

  const preloadImage = async () => {
    const imgUri = `https://raw.githubusercontent.com/CS571-F23/hw8-api-static-content/main/articles/${selectedArticle.img}`

    try {
      await Image.prefetch(imgUri)
      setIsLoading(true)
      fadeIn()
    } catch (error) {
      console.error("Error preloading image:", error)
    }
  }

  const fadeIn = () => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => setIsLoading(false))
  }

  const handleCardWhenPressed = (article) => {
    fetchArticleDetails(article.fullArticleId)
  }

  const fetchArticleDetails = (articleId) => {
    fetch(`https://cs571.org/api/f23/hw8/article?id=${articleId}`, {
      headers: {
        "X-CS571-ID":
          "bid_8de1afeb832f02dbab913e76b98a6023d9936230d9545eea701bb48fc2f36a2e",
      },
    })
      .then((response) => response.json())
      .then((data) => setSelectedArticle(data))
      .catch((error) => console.error("Cannot get article details:", error))
  }

  const renderCardDetails = () => {
    if (!selectedArticle) {
      return null
    }

    const { img, title, body, author, posted, url } = selectedArticle

    const openUrl = () => {
      Linking.openURL(url)
    }

    return (
      <ScrollView>
        {isLoading ? (
          <View style={styles.container}>
            <Text style={styles.text}>Loading...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeInAnim }}>
            <View>
              <Image
                source={{
                  uri: `https://raw.githubusercontent.com/CS571-F23/hw8-api-static-content/main/articles/${img}`,
                }}
                style={{ height: 200, width: "100%", resizeMode: "cover" }}
              />
              <Text style={{ fontSize: 18, fontWeight: "bold", padding: 10 }}>
                {title}
              </Text>

              <Text style={{ fontStyle: "italic", padding: 10 }}>
                By {author} on {posted}
              </Text>
              {Array.isArray(body) && body.length > 0 ? (
                body.map((paragraph, index) => (
                  <Text key={index} style={{ padding: 10 }}>
                    {paragraph}
                  </Text>
                ))
              ) : (
                <Text style={{ fontStyle: "italic", padding: 10 }}>
                  No body to display
                </Text>
              )}

              <Pressable onPress={openUrl}>
                <Text style={{ color: "blue", padding: 10 }}>
                  Read full article here
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    )
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 24, // Adjust the size as needed
      fontWeight: "bold",
      textAlign: "center",
    },
  })

  const renderNewsList = () => {
    const filteredArticles = Array.isArray(articles)
      ? articles.filter((article) =>
          Object.keys(prefs).some((pref) =>
            prefs[pref] ? article.tags.includes(pref) : false
          )
        )
      : []

    if (filteredArticles.length === 0) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No articles to be displayed based on your preferences</Text>
        </View>
      )
    }
    return (
      <View>
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCardWhenPressed(item)}>
              <BadgerNewsItemCard article={item} />
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }

  return <View>{selectedArticle ? renderCardDetails() : renderNewsList()}</View>
}

export default BadgerNewsScreen
