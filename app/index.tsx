import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.internalWrapper}>
          <Image
            source={require("@/assets/images/foto1.png")}
            style={styles.avatar}
          />
          <Text style={styles.nameText}>Nicholas Andre Natalino</Text>
          <Text style={styles.detailText}>00000092117</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.internalWrapper}>
          <Image
            source={require("@/assets/images/foto2.png")}
            style={styles.avatar}
          />
          <Text style={styles.nameText}>Johan Mandoro</Text>
          <Text style={styles.detailText}>00000092317</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.internalWrapper}>
          <Image
            source={require("@/assets/images/foto3.png")}
            style={styles.avatar}
          />
          <Text style={styles.nameText}>Jeffrey Eipstein</Text>
          <Text style={styles.detailText}>00000093987</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.internalWrapper}>
          <Image
            source={require("@/assets/images/foto4.png")}
            style={styles.avatar}
          />
          <Text style={styles.nameText}>Albert Einstein</Text>
          <Text style={styles.detailText}>00000096987</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  card: {
    padding: 20,
    borderBottomWidth: 1,
    marginLeft: 20,
    borderColor: "#ccc",
    alignItems: "center",
  },
  internalWrapper: {
    width: 200,
    alignItems: "center",
  },
  avatar: {
    width: 200,
    height: 250,
    marginBottom: 10,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  detailText: {
    color: "#555",
    textAlign: "center",
  },
});
