import { Stack } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import styles from "./AppStyles";
import userData from "./data.json";

export default function App() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "User List" }} />

      <ScrollView style={{ backgroundColor: theme.colors.onBackground }}>
        {userData.map((users, index) => (
          <View
            key={index}
            style={[
              styles.container,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <View
              style={[
                styles.card,
                { borderColor: theme.colors.outline },
                { backgroundColor: theme.colors.onBackground },
              ]}
            >
              <Image source={{ uri: users.photo_url }} style={styles.avatar} />
              <View>
                <Text
                  style={[styles.boldText, { color: theme.colors.background }]}
                >
                  {users.name}
                </Text>
                <Text style={{ color: theme.colors.surfaceVariant }}>
                  {users.email}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
