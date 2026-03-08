import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase/client";
import { uploadProfileImage } from "@/src/lib/supabase/storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Premission need",
        "We need gallary permission to select a profile image",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Premission need",
        "We need camera permission to take a photo",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Choose an Option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Photo Gallary", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleComplete = async () => {
    if (!name || !username) {
      Alert.alert("Error", "Please fill in all fields");
    }
    if (username.length < 4) {
      Alert.alert("Error", "Username must be at least 4 characters");
    }

    setIsLoading(true);

    try {
      // Check if username exists
      const { data: existingUser } = await supabase
        .from("profile")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .single();

      if (existingUser) {
        Alert.alert(
          "Error",
          "This username ia already taken.Please choose another one.",
        );
        setIsLoading(false);
        return;
      }
      let profileImageUrl: string | undefined;
      if (profileImage) {
        try {
          profileImageUrl = await uploadProfileImage(user.id, profileImage);
        } catch (error) {
          console.error("Error uploading profile image:", error);
          Alert.alert(
            "Warning",
            "Failed to upload profile image. Continuing without image.",
          );
        }
      }

      // Update profile
      await updateUser({
        name,
        username,
        profileImage: profileImageUrl,
        onboardingCompleted: true,
      });
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to complete setup.Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={style.container}>
      <View style={style.content}>
        <View style={style.header}>
          <Text style={style.title}>Complete Your Profile</Text>
          <Text style={style.subtitle}>
            Add your information to get Started
          </Text>
        </View>

        <View style={style.form}>
          <TouchableOpacity
            style={style.imageContainer}
            onPress={showImagePicker}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={style.profileImage}
              />
            ) : (
              <View style={style.placeholderImage}>
                <Text style={style.placeholderText}>+</Text>
              </View>
            )}
            <View style={style.editBadge}>
              <Text style={style.editText}>Edit</Text>
            </View>
          </TouchableOpacity>

          <TextInput
            style={style.input}
            placeholder="Full Name"
            placeholderTextColor={"#999"}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={style.input}
            placeholder="Username"
            placeholderTextColor={"#999"}
            autoCapitalize="none"
            autoComplete="username"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity style={style.button} onPress={handleComplete}>
            {isloading ? (
              <ActivityIndicator size={24} color="#fff" />
            ) : (
              <Text style={style.buttonText}>Complete Setup</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
    color: "#667",
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 32,
    position: "relative",
  },
  profileImage: {
    width: 300,
    height: 300,
    borderRadius: 1500,
    backgroundColor: "#f5f5f5",
  },
  placeholderImage: {
    width: 300,
    height: 300,
    backgroundColor: "#f5f5f5",
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    position: "relative",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 60,
    color: "#999",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    width: "100%",
    borderColor: "#e0e0e0",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  linkButton: {
    marginTop: 24,
    alignItems: "center",
  },

  linkButtonText: {
    color: "#667",
    fontSize: 16,
  },

  linkButtonTextBold: {
    fontWeight: "600",
    color: "#000",
  },
});
