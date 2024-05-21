import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const navigation = useNavigation();

  const handleSignUp = () => {
    // HTTP isteği için gereken veriler
    const data = {
      email: email,
      password: password,
      phone_number: phone,
      name: name,
      usertype: 'normal' // Varsayılan olarak normal kullanıcı tipi
    };
  
    // HTTP isteği için ayarlar
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  
    // HTTP isteği gönder
    fetch('http://192.168.1.23:3000/register', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Üye olma işlemi başarısız');
        }
        return response.json();
      })
      .then(data => {
        // Üye olma işlemi başarılı
        console.log('Kullanıcı kaydı başarılı');
        navigation.navigate('Login'); // Kayıt başarılı olduğunda giriş sayfasına yönlendirme
      })
      .catch(error => {
        // Hata durumunda
        alert(error.message);
      });
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Şifre'
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='Telefon Numarası'
          keyboardType='phone-pad'
          value={phone}
          onChangeText={text => setPhone(text)}
        />
        <TextInput
          style={styles.input}
          placeholder='İsim'
          value={name}
          onChangeText={text => setName(text)}
        />
      </View>
      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
        <Text style={styles.buttonText}>Üye Ol</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
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
    marginTop: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
