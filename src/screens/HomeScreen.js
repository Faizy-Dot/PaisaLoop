import { getAuth } from '@react-native-firebase/auth';
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';



export default function HomeScreen({ navigation }) {
    const user = getAuth().currentUser;

    console.log(user.displayName);
    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Logout</Text>
            </TouchableOpacity>

            <View style={{  justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 22 }}>
                    Welcome {user?.displayName}
                </Text>

                <Text>{user?.email}</Text>
            </View>
        </SafeAreaView>
    )
}