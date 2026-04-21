import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPosts } from "../services/api";

export default function Index() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getAllPosts();
  }, []);

  const getAllPosts = () => {
    getPosts()
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Daftar Postingan (Modul 8)</Text>

      {/* Tambahan Tombol Add New Post */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/addPost")}
      >
        <Text style={styles.addButtonText}>+ Add New Post</Text>
      </TouchableOpacity>

      <ScrollView>
        {posts.map((post) => (
          <Pressable
            key={post.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/postDetail",
                params: { id: post.id, userId: post.userId },
              })
            }
          >
            <Text style={styles.postId}>Post Number: {post.id}</Text>
            <Text style={styles.postTitle}>Title: {post.title}</Text>
            <Text numberOfLines={2} style={styles.postBody}>
              Body: {post.body}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// Tambahkan gaya ini di StyleSheet yang sudah ada di bawah
const styles = StyleSheet.create({
  // ... (gaya container, headerTitle, card, dll biarkan seperti sebelumnya)
  container: { flex: 1, backgroundColor: "#f8fafc", paddingTop: 20 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#10b981",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 2,
  },
  postId: { fontSize: 12, color: "#64748b", marginBottom: 4 },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  postBody: { fontSize: 14, color: "#475569" },
});
