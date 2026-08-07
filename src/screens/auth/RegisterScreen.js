import { createUserWithEmailAndPassword, getAuth, updateProfile } from '@react-native-firebase/auth';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApp } from '@react-native-firebase/app';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import axios from 'axios';

console.log(getApp().name);

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.didCancel) return;

    if (result.errorCode) {
      console.log(result.errorMessage);
      return;
    }

    if (result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0]);
    }
  };
  ;



const uploadImageToCloudinary = async (imageUri) => {
  const data = new FormData();

  data.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });

  data.append('upload_preset', 'paisaloop');

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/dw2yrad8x/image/upload',
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data.secure_url;
};

  const registerUser = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill all fields',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters',
      });
      return;
    }

    try {
      setLoading(true);

      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const imageUrl = profileImage
        ? await uploadImageToCloudinary(profileImage.uri)
        : null;

      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: imageUrl,
      });

      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'Welcome to PaisaLoop 👋',
      });

      setTimeout(() => {
        navigation.replace('Home');
      }, 1000);

    } catch (error) {
      console.log(error);

      if (error.code === 'auth/email-already-in-use') {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: 'Email already exists',
        });
      } else if (error.code === 'auth/invalid-email') {
        Toast.show({
          type: 'error',
          text1: 'Invalid Email',
          text2: 'Please enter a valid email address',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Image */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={pickImage}
      >
        <Image
          source={{
            uri: profileImage?.uri
              ? profileImage.uri
              : 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
          }}
          style={styles.profileImage}
        />

        <Text style={styles.changePhoto}>
          Add Profile Photo
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={registerUser}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          {loading ? 'Creating Account...' : 'Register'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Already have an account?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <Text style={styles.loginText}> Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#1E8E5A',
  },
  changePhoto: {
    marginTop: 8,
    color: '#1E8E5A',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E8E5A',
    marginBottom: 25,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  registerButton: {
    height: 55,
    backgroundColor: '#1E8E5A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: '#666',
  },
  loginText: {
    color: '#1E8E5A',
    fontWeight: 'bold',
  },
});