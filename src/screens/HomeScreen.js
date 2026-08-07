import { getAuth } from '@react-native-firebase/auth';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user);

 const logoutFunc = async () => {
  try {
    const auth = getAuth();

    if (auth.currentUser) {
      await auth.signOut();
    }

    dispatch(logout());
  } catch (error) {
    console.log('Firebase logout error:', error);

    // Still clear Redux
    dispatch(logout());
  }
};

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={logoutFunc}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{fontSize: 22}}>
          Welcome {user?.name}
        </Text>

        {user?.photo ? (
          <Image
            source={{uri: user.photo}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}
          />
        ) : null}

        <Text>{user?.email}</Text>
      </View>
    </SafeAreaView>
  );
}