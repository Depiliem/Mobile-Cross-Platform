import { Button, StyleSheet, Text, View } from "react-native";

interface iCounter {
  handleIncrement: () => void;
  handleDecrement: () => void;
  handleValue: () => void;
  value: number;
}

const Counter = ({
  handleIncrement,
  handleDecrement,
  handleValue,
  value,
}: iCounter) => {
  return (
    <View style={styles.counterContainer}>
      <Text style={styles.countDisplay}>{value}</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Increment" onPress={handleIncrement} />
        <Button title="Decrement" onPress={handleDecrement} />
        <Button title="Pass Value" onPress={handleValue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  countDisplay: {
    fontSize: 18,
    marginBottom: 5,
  },
  buttonWrapper: {
    width: 150,
    gap: 5,
  },
});

export default Counter;
