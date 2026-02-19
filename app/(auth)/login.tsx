import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top", "bottom"]} style={style.container}>
      <View style={style.content}>
        <Text style={style.title}>Welcome Back</Text>
        <Text style={style.subtitle}>Sign In to Continue</Text>
        <View style={style.form}>
          <TextInput
            placeholder="Email...."
            placeholderTextColor={"#999"}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            style={style.input}
          />
          <TextInput
            placeholder="Password...."
            placeholderTextColor={"#999"}
            autoComplete="password"
            autoCapitalize="none"
            secureTextEntry
            style={style.input}
          />
          <TouchableOpacity style={style.button}>
            <Text style={style.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.linkButton}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={style.linkButtonText}>
              Don't have an account?{" "}
              <Text style={style.linkButtonTextBold}>Sign up</Text>
            </Text>
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
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
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
