import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'

export default function HomeScreen() {
  const navigation = useNavigation();
  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigation.navigate('Login')
      console.log('User signed out');
    }).catch(error => alert(error.message));
  };

  return (
    <View>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})