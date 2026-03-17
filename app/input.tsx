import { Text, TextInput, View } from "react-native";

export interface CustomProps {
  onChange: (val: string) => void;
  input: string;
}

export const CustomTextInput = ({ input, onChange }: CustomProps) => {
  return (
    <View>
      <Text>Name</Text>
      <TextInput
        placeholder="Input your name"
        style={{
          borderColor: "black",
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
        }}
        onChangeText={onChange}
        value={input}
      />
    </View>
  );
};

export const NIMInput = ({ input, onChange }: CustomProps) => {
  return (
    <View style={{ width: 200 }}>
      <Text>NIM</Text>
      <TextInput
        placeholder="Input your NIM/Student ID"
        style={{
          borderColor: "black",
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
        }}
        onChangeText={onChange}
        keyboardType="numeric"
        value={input}
      />
    </View>
  );
};
