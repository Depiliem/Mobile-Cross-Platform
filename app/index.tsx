import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function requestNotificationPermissions() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Gagal", "Akses notifikasi tidak diberikan");
  }
}

async function triggerLocalNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger: null,
  });
}

export default function Index() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const cameraRef = useRef<any>(null);

  const NAMA = "Dave Wiliam - 00000093527";

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

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

  const handleOpenGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
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
      lat: String(loc.coords.latitude.toFixed(6)),
      lon: String(loc.coords.longitude.toFixed(6)),
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
        "Ambil foto dan lokasi terlebih dahulu",
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

      await triggerLocalNotification(
        "Upload Berhasil",
        `Data tersimpan. Lat: ${coords.lat}, Lon: ${coords.lon}`,
      );

      Alert.alert("Berhasil", "Data telah terkirim ke Supabase");
      setPhotoUri(null);
      setCoords(null);
    } catch (error: any) {
      await triggerLocalNotification(
        "Upload Gagal",
        `Gagal mengirim data. Lat: ${coords.lat}, Lon: ${coords.lon}`,
      );

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
          <Button title="OPEN GALLERY" onPress={handleOpenGallery} />
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
          Lat: {coords.lat}, Lon: {coords.lon}
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
          title={isUploading ? "MENGIRIM" : "KIRIM KE SUPABASE"}
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
