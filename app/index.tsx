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
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef<any>(null);

  const NAMA = "Dave - 00000093527";

  if (!cameraPermission)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!cameraPermission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Izin Kamera diperlukan</Text>
        <Button title="Beri Izin" onPress={requestCameraPermission} />
      </View>
    );
  }

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
        });
        setPhotoUri(photo.uri);
        setIsCameraOpen(false);
      } catch (e) {
        Alert.alert("Error", "Gagal mengambil foto");
      }
    }
  };

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Ditolak", "Izin lokasi diperlukan");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setCoords({
      lat: loc.coords.latitude.toFixed(6),
      lon: loc.coords.longitude.toFixed(6),
    });
    Alert.alert(
      "Lokasi Berhasil",
      `Lat: ${loc.coords.latitude}, Lon: ${loc.coords.longitude}`,
    );
  };

  const handleSendToSupabase = async () => {
    if (!photoUri || !coords) {
      Alert.alert(
        "Data Belum Lengkap",
        "Ambil foto dan lokasi terlebih dahulu!",
      );
      return;
    }

    setIsUploading(true);
    try {
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
          latitude: coords.lat,
          longitude: coords.lon,
          image_url: publicUrlData.publicUrl,
        },
      ]);
      if (dbError) throw dbError;

      Alert.alert("Berhasil!", "Data telah terkirim ke Supabase");
      setPhotoUri(null);
      setCoords(null);
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isCameraOpen) {
    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} ref={cameraRef} />
        <View style={styles.cameraControls}>
          <Button
            title="Cancel"
            onPress={() => setIsCameraOpen(false)}
            color="red"
          />
          <Button title="Confirm" onPress={handleTakePicture} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headerText}>{NAMA}</Text>

      <View style={styles.buttonGroup}>
        <View style={styles.btnMargin}>
          <Button title="OPEN CAMERA" onPress={() => setIsCameraOpen(true)} />
        </View>
        <View style={styles.btnMargin}>
          <Button
            title="AMBIL LOKASI"
            color="#0ea5e9"
            onPress={handleGetLocation}
          />
        </View>
      </View>

      {coords && (
        <Text style={styles.locationText}>
          {coords.lat}, {coords.lon}
        </Text>
      )}

      <View style={styles.imageFrame}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "white" }}>Belum ada foto</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title={isUploading ? "MENGIRIM..." : "KIRIM KE SUPABASE"}
          disabled={isUploading}
          color="#10b981"
          onPress={handleSendToSupabase}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContainer: {
    flex: 1,
    padding: 40,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
    color: "#374151",
  },
  buttonGroup: { width: "100%", marginBottom: 10 },
  btnMargin: { marginBottom: 10 },
  locationText: { fontSize: 14, color: "#0369a1", marginBottom: 10 },
  imageFrame: {
    width: 300,
    height: 300,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    marginBottom: 30,
  },
  placeholder: { flex: 1, justifyContent: "center" },
  imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
  camera: { flex: 1 },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "black",
  },
  footer: { width: "100%", marginTop: "auto" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginBottom: 10 },
});
