import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider
      settings={{
        icon: (props) => <FontAwesome {...props} />,
      }}
    >
      <Stack />
    </PaperProvider>
  );
}
