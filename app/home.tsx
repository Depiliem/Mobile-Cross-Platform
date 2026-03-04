import { Link, useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";

export default function home() {
  const { userName } = useLocalSearchParams<{ userName: string }>();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <Link href="/userList" asChild>
        <Button title="Go to User List Page" color="#2196F3" />
      </Link>
    </View>
  );
}
