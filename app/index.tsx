import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [image, setImage] = useState<string | null>(null);

  const openCamera = async () => {
    const permission = await Camera.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Izin Ditolak", "Aplikasi membutuhkan izin kamera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Izin Ditolak", "Aplikasi membutuhkan izin galeri!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveImage = async () => {
    if (!image) {
      Alert.alert("Gagal", "Tidak ada gambar untuk disimpan!");
      return;
    }

    try {
      const permission = await MediaLibrary.requestPermissionsAsync(true);
      if (!permission.granted) {
        Alert.alert(
          "Izin Ditolak",
          "Aplikasi membutuhkan izin untuk menyimpan ke galeri.",
        );
        return;
      }

      if (!FileSystem.documentDirectory) {
        Alert.alert("Error", "Sistem file tidak tersedia di perangkat ini.");
        return;
      }

      const extension = image.split(".").pop() || "jpg";
      const uniqueFilename = `IMG_${Date.now()}.${extension}`;
      const newPath = FileSystem.documentDirectory + uniqueFilename;

      await FileSystem.copyAsync({
        from: image,
        to: newPath,
      });

      await MediaLibrary.saveToLibraryAsync(newPath);

      Alert.alert(
        "Sukses",
        "Gambar berhasil disimpan ke galeri perangkat Anda!",
      );
    } catch (error: any) {
      console.log("Trace Error Asli:", error);
      Alert.alert("Detail Error", error?.message || String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dave Wiliam - 00000093527</Text>

      <View style={styles.button}>
        <Button title="OPEN CAMERA" onPress={openCamera} color="#3b82f6" />
      </View>

      <View style={styles.button}>
        <Button title="OPEN GALLERY" onPress={openGallery} color="#10b981" />
      </View>

      {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={[styles.button, { marginTop: 20 }]}>
            <Button title="SAVE IMAGE" onPress={saveImage} color="#f59e0b" />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  button: {
    marginVertical: 8,
    width: 200,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 12,
    resizeMode: "cover",
  },
});
