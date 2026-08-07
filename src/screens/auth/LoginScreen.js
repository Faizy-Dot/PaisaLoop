import React, { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';



export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userCredential = getAuth().currentUser;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const loginUser = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      dispatch(
        login({
          uid: userCredential.user.uid,
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          photo: userCredential.user.photoURL,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back 👋',
      });
     
    } catch (error) {
      console.log(error);

      switch (error.code) {
        case 'auth/invalid-credential':
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: 'Invalid email or password',
          });
          break;

        case 'auth/user-not-found':
          Toast.show({
            type: 'error',
            text1: 'User Not Found',
            text2: 'No account exists with this email.',
          });
          break;

        case 'auth/wrong-password':
          Toast.show({
            type: 'error',
            text1: 'Incorrect Password',
            text2: 'Please try again.',
          });
          break;

        case 'auth/invalid-email':
          Toast.show({
            type: 'error',
            text1: 'Invalid Email',
            text2: 'Please enter a valid email address.',
          });
          break;

        default:
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message,
          });
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      await GoogleSignin.signIn();

      const tokens = await GoogleSignin.getTokens();

      console.log('Tokens:', tokens);

      const credential = GoogleAuthProvider.credential(tokens.idToken, tokens.accessToken);

      console.log("credential==>>>", credential)

      const userCredential = await signInWithCredential(
        getAuth(),
        credential,
      );

      dispatch(
        login({
          uid: userCredential.user.uid,
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          photo: userCredential.user.photoURL,
        }),
      );

      Toast.show({
        type: 'success',
        text1: 'Google Login Successful',
        text2: 'Welcome back 👋',
      });
     
      console.log("google user ==>>", userCredential.user);


    } catch (e) {
      console.log(e);
      alert(e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        {/* <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <Text style={styles.title}>PaisaLoop</Text>
        <Text style={styles.subtitle}>
          Community Savings Made Simple
        </Text>
      </View>

      {/* Email */}
      <TextInput
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={loginUser}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Google Sign In */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={signInWithGoogle}
      >
        <FontAwesome name="google" size={24} color="#DB4437" />
        <Text style={styles.googleText}>
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Register */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            {' '}Register Here
          </Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E8E5A',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
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
  loginButton: {
    backgroundColor: '#1E8E5A',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  loginText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
  },
  googleButton: {
    height: 55,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
  },
  registerText: {
    color: '#1E8E5A',
    fontWeight: 'bold',
  },
});