import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Counter from "./counter";

interface iProfile {
  name: string;
  age: number;
}

const Profile = ({ name, age }: iProfile) => {
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileText}>Nama gw {name}</Text>
      <Text style={styles.profileText}>umur gw {age}</Text>
    </View>
  );
};

export default function Index() {
  const [count, setCount] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [submittedData, setSubmittedData] = useState({
    name: "Anonymous",
    age: 0,
  });
  const handleIncrement = () => {
    setCount(count + 1);
  };
  const handleDecrement = () => {
    setCount(count - 1);
  };
  const handleValue = () => {
    setSubmittedData({
      name: nameInput || "Anonymous",
      age: count,
    });
  };

  return (
    <View style={styles.container}>
      <Profile name={submittedData.name} age={submittedData.age} />
      <Counter
        value={count}
        handleDecrement={handleDecrement}
        handleIncrement={handleIncrement}
        handleValue={handleValue}
      />

      <TextInput
        style={styles.input}
        placeholder="Input your name here"
        value={nameInput}
        onChangeText={setNameInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    width: 250,
    padding: 8,
    marginTop: 20,
    textAlign: "center",
  },
});
