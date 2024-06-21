import { View, Text, ScrollView } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import React, { useState, useEffect } from "react"

const stackNavigator = createStackNavigator()

const ArticleDetailsScreen = ({ route }) => {
  const [cardDetails, setCardDetails] = useState(null)
  const { articleId } = route.params

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response = await fetch(
          `https://cs571.org/api/f23/hw8/article?id=${articleId}`,
          {
            headers: {
              "X-CS571-ID":
                "bid_8de1afeb832f02dbab913e76b98a6023d9936230d9545eea701bb48fc2f36a2e",
            },
          }
        )
        const data = await response.json()
        setCardDetails(data)
      } catch (error) {
        console.error("Cannot fetch article details:", error)
      }
    }

    fetchArticleDetails()
  }, [articleId])

  const renderContent = () => {
    if (!cardDetails) {
      return (
        <View>
          <Text>The content is loading!</Text>
        </View>
      )
    }

    const { author, posted, body } = cardDetails

    return (
      <ScrollView>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          Article
        </Text>
        <Text>Author: {author}</Text>
        <Text>Posted: {posted}</Text>
        {body.map((paragraph, index) => (
          <Text key={index}>{paragraph}</Text>
        ))}
      </ScrollView>
    )
  }

  return renderContent()
}

const CardDetailsStack = () => {
  return (
    <stackNavigator.Navigator>
      <stackNavigator.Screen
        name="cardDetails"
        component={ArticleDetailsScreen}
        options={{ headerShown: false }}
      />
    </stackNavigator.Navigator>
  )
}

export default CardDetailsStack
