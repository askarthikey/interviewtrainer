import { useAuth } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import React, { useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Redirect to home if already signed in
  if (isLoaded && isSignedIn) {
    return <Redirect href="/(home)" />;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, ...styles.content }}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Interview Trainer</Text>
          <Text style={styles.tagline}>Prepare for your next interview</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Link href="/(auth)/sign-in" asChild>
              <Text style={styles.primaryButtonText}>Login</Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Link href="/(auth)/sign-up" asChild>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features:</Text>
          <Text style={styles.featureItem}>• Resume Analysis</Text>
          <Text style={styles.featureItem}>• Interview Preparation</Text>
          <Text style={styles.featureItem}>• Feedback & Suggestions</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: "#4285F4",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderColor: "#4285F4",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4285F4",
    fontSize: 16,
    fontWeight: "600",
  },
  featuresContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  featureItem: {
    fontSize: 14,
    marginVertical: 5,
    color: "#555",
  },
});
