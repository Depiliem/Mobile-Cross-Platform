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
    <View>
      <Text>{value}</Text>
      <Button title="Increment" onPress={handleIncrement} />
      <Button title="Decrement" onPress={handleDecrement} />
      <Button title="Pass Value" onPress={handleValue} />
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    alignItems: "center",
    marginBottom: 5,
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
