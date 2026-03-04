import { Link, Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import styles from "./AppStyles";

export default function Profile() {
  const { id, name, email, photo } = useLocalSearchParams<{
    id: string;
    name: string;
    email: string;
    photo: string;
  }>();

  return (
    <View style={styles.profileContainer}>
      <Stack.Screen options={{ title: `Profile: ${name}` }} />

      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Avatar.Image size={120} source={{ uri: photo }} />
          <Text variant="headlineMedium" style={styles.nameText}>
            {name}&apos;s Profile
          </Text>
        </View>

        <Card.Content style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email Address:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
        </Card.Content>
      </Card>

      <Link href="/home" push asChild>
        <Button mode="contained" style={{ marginTop: 20 }}>
          Go to Home Screen
        </Button>
      </Link>
    </View>
  );
}
