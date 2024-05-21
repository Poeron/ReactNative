import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()

  const handleSignUp = () => {
    navigation.navigate('Register')
  }

  const handleLogin = () => {
    // HTTP isteği için gereken veriler
    const data = {
      email: email,
      password: password
    };
  
    // HTTP isteği için ayarlar
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(data)
    };
  
    // HTTP isteği gönder
    fetch('http://192.168.1.23:3000/login', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Kullanıcı girişi başarısız');
        }
        return response.json();
      })
      .then(data => {
        // Kullanıcı girişi başarılı
        console.log('Kullanıcı', data.email);
        
        // Kullanıcı girişi başarılı olduğunda ilgili ekrana yönlendirme
        if(data.usertype === 'admin'){
          navigation.navigate('AdminScreen')
        } else {
          navigation.navigate('UserScreen', { userId: data.id })
        }
      })
      .catch(error => {
        // Hata durumunda
        alert(error.message);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Sifre'
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Giris Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUp} style={[styles.button, styles.outlineButton]}>
          <Text style={styles.outlineButtonText}>Kayit Ol</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '60%',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  outlineButton: {
    backgroundColor: 'white',
    marginTop: 5,
  },
  outlineButtonText: {
    color: '#0782F9',
    fontSize: 16,
  },
})
