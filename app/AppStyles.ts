import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    display: "flex",
  },
  card: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    width: 325,
    gap: 8,
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 0,
  },
  textContainer: {
    flexDirection: "column",
    marginLeft: 10,
    justifyContent: "center",
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 999,
  },
  boldText: {
    fontWeight: "bold",
  },
  profileContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    alignItems: "center",
  },
  profileCard: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    backgroundColor: "white",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  nameText: {
    fontWeight: "bold",
    marginTop: 15,
    color: "black",
  },
  subText: {
    color: "black",
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  infoRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "brown",
  },
});

export default styles;
