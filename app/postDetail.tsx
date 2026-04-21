import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getComments, getPostDetail, getUserDetail } from "../services/api";

export default function PostDetail() {
  const { id, userId } = useLocalSearchParams<{ id: string; userId: string }>();

  const [user, setUser] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (id && userId) {
      getPostDetailData();
      getUserData();
      getCommentsData();
    }
  }, [id, userId]);

  const getUserData = () => {
    getUserDetail(Number(userId))
      .then((res) => {
        if (res.status === 200) setUser(res.data);
      })
      .catch((err) => console.log("Error fetch user:", err));
  };

  const getPostDetailData = () => {
    getPostDetail(Number(id))
      .then((res) => {
        if (res.status === 200) setPost(res.data);
      })
      .catch((err) => console.log("Error fetch post:", err));
  };

  const getCommentsData = () => {
    getComments(Number(id))
      .then((res) => {
        if (res.status === 200) setComments(res.data);
      })
      .catch((err) => console.log("Error fetch comments:", err));
  };

  if (!post || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10 }}>Memuat Detail...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.body}</Text>

        <View style={styles.divider} />

        <Text style={styles.creatorHeader}>Post Created By</Text>
        <Text style={styles.creatorText}>Name: {user.name}</Text>
        <Text style={styles.creatorText}>Email: {user.email}</Text>
      </View>

      <Text style={styles.commentHeader}>Komentar ({comments.length})</Text>

      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentCard}>
          <Text style={styles.commentEmail}>{comment.email}</Text>
          <Text style={styles.commentName}>{comment.name}</Text>
          <Text style={styles.commentBody}>{comment.body}</Text>
        </View>
      ))}

      {/* Spacer agar komentar terbawah tidak tertutup batas layar */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0f172a",
    marginBottom: 12,
    textTransform: "capitalize",
  },
  body: {
    fontSize: 16,
    textAlign: "center",
    color: "#475569",
    marginBottom: 20,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#cbd5e1",
    marginVertical: 16,
  },
  creatorHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 8,
  },
  creatorText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  commentHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
    marginLeft: 4,
  },
  commentCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  commentEmail: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
    textTransform: "capitalize",
  },
  commentBody: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});
