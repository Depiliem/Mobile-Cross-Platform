import { Link } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import styles from "./AppStyles";
import userData from "./data.json";

export default function userList() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData.map((user, index) => (
        <Animated.View key={index} entering={FadeInDown.delay(index * 150)}>
          <Card style={styles.card}>
            <Link
              href={{
                pathname: "/profile",
                params: {
                  name: user.name,
                  email: user.email,
                  photo: user.photo_url,
                },
              }}
              asChild
            >
              <TouchableOpacity>
                <Card.Content style={styles.cardContent}>
                  <Avatar.Image size={70} source={{ uri: user.photo_url }} />
                  <View style={styles.textContainer}>
                    <Text variant="titleMedium" style={styles.boldText}>
                      {user.name}
                    </Text>
                    <Text variant="bodyMedium">{user.email}</Text>
                  </View>
                </Card.Content>
              </TouchableOpacity>
            </Link>
          </Card>
        </Animated.View>
      ))}
    </ScrollView>
  );
}
