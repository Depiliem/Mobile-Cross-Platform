import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function Index() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!cameraPermission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Aplikasi membutuhkan izin akses kamera.</Text>
        <Button title="Beri Izin Kamera" onPress={requestCameraPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
        });
        setPhotoUri(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Gagal menangkap gambar. Silakan coba lagi.");
      }
    }
  };

  const uploadAndSave = async () => {
    setIsUploading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Akses Ditolak",
          "Izin lokasi dibutuhkan untuk menyimpan data koordinat.",
        );
        setIsUploading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = String(location.coords.latitude);
      const lon = String(location.coords.longitude);
      const fileName = `photo-${Date.now()}.jpg`;

      const formData = new FormData();
      formData.append("file", {
        uri: photoUri,
        name: fileName,
        type: "image/jpeg",
      } as any);

      const { error: storageError } = await supabase.storage
        .from("camera")
        .upload(fileName, formData);

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from("camera")
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("photo").insert([
        {
          latitude: lat,
          longitude: lon,
          image_url: publicUrlData.publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      Alert.alert(
        "Sukses",
        "Foto dan data lokasi berhasil diunggah ke Supabase.",
      );
      setPhotoUri(null);
    } catch (error: any) {
      Alert.alert(
        "Kesalahan Sistem",
        error.message || "Gagal mengunggah data.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <View style={styles.container}>
          <CameraView style={styles.camera} ref={cameraRef} />
          <View style={styles.overlayButtonContainer}>
            <Button title="AMBIL FOTO" onPress={takePicture} color="#2563eb" />
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <View style={styles.actionButtons}>
            <View style={styles.buttonWrapper}>
              <Button
                title="ULANGI"
                onPress={() => setPhotoUri(null)}
                disabled={isUploading}
                color="#ef4444"
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                title="UPLOAD & SIMPAN"
                onPress={uploadAndSave}
                disabled={isUploading}
                color="#10b981"
              />
            </View>
          </View>
          {isUploading && (
            <ActivityIndicator
              size="large"
              color="#ffffff"
              style={styles.loader}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  text: {
    marginBottom: 20,
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  camera: {
    flex: 1,
  },
  overlayButtonContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#ffffff",
    paddingBottom: 40,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -18,
    marginTop: -18,
  },
});
