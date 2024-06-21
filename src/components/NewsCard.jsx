import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"

const NewsCard = ({ article }) => {
  const { img, title } = article

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardDetails}>
        <Image
          source={{
            uri: `https://raw.githubusercontent.com/CS571-F23/hw8-api-static-content/main/articles/${img}`,
          }}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderRadius: 10,
    elevation: 8,
    overflow: "hidden",
    borderColor: "#fff",
    margin: 8,
  },
  cardDetails: {
    backgroundColor: "white",
    overflow: "hidden",
    borderRadius: 7,
  },
  cardImage: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
})

export default NewsCard
