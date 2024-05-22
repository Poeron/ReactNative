import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const MainScreen = () => {
  const { userId } = useRoute().params; // Route parametresinden userId'yi al
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservationTimes, setReservationTimes] = useState([]);
  const navigation = useNavigation();

  const handleSignOut = () => {
    // Kullanıcıyı çıkış yapmaya yönlendir
    navigation.navigate('Login');
    console.log('User signed out');
  };

  const handlePreviousDate = () => {
    // Seçilen tarihi bir önceki güne ayarla
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDate = () => {
    // Seçilen tarihi bir sonraki güne ayarla
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleHourSelect = (hour) => {
    // Seçilen saati ayarla ve modalı görünür yap
    setSelectedHour(hour);
    setModalVisible(true);
  };

  const handleAppointment = () => {
    // Seçilen tarihe bir gün ekleyerek yeni bir tarih oluştur
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setDate(appointmentDate.getDate()); // Seçili tarihe bir gün ekleyerek güncelle
  
    // Randevu oluşturma işlemi
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        reservation_date: appointmentDate.toISOString().split('T')[0], // YYYY-MM-DD formatına dönüştür
        reservation_time: selectedHour
      })
    };
  
    fetch('http://192.168.1.23:3000/reservations', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Randevu oluşturuldu:', data);
        alert('Randevu oluşturuldu');
        setModalVisible(false);
      })
      .catch(error => {
        console.error('Randevu oluşturulurken bir hata oluştu:', error);
        alert('Randevu oluşturulurken bir hata oluştu');
      });
  };

  const fetchReservations = (date) => {
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setDate(appointmentDate.getDate()); // Seçili tarihe bir gün ekleyerek güncelle
    // Belirli bir tarihe ait rezervasyon saatlerini getirme işlemi
    fetch(`http://192.168.1.23:3000/home/reservations?date=${appointmentDate.toISOString().split('T')[0]}`)
      .then(response => response.json())
      .then(data => {
        // Gelen veriyi doğru formatta kontrol etme
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
          // Saatleri bir diziye atama
          const reservationTimes = data.map(time => time.split(':')[0] + ':' + time.split(':')[1]); // Saat ve dakika kısmını al
          console.log('Rezervasyon saatleri:', reservationTimes);
          setReservationTimes(reservationTimes);
        } else {
          console.log('Beklenen formatta veri bulunamadı.');
          // Beklenen formatta veri bulunamadı hatası işleme...
        }
      })
      .catch(error => {
        console.error('Verileri alma hatası:', error);
        // Hata durumunda işlem yapma...
      });
  };

  useEffect(() => {
    setReservationTimes([]); // Rezervasyon saatlerini sıfırla (her güncellemede)
    fetchReservations(selectedDate.toISOString().split('T')[0]); // Başlangıçta seçilen tarihe ait rezervasyonları getir
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <MaterialIcons name="arrow-back" size={24} color="black" onPress={handlePreviousDate} />
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        </View>
        <MaterialIcons name="arrow-forward" size={24} color="black" onPress={handleNextDate} />
      </View>
      <View style={styles.timeContainer}>
        <TimeList handleHourSelect={handleHourSelect} reservationTimes={reservationTimes} />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>Randevu Tarihi: {selectedDate.toDateString()}</Text>
            <Text>Seçilen Saat: {selectedHour}</Text>
            <Button title="Randevu Al" onPress={handleAppointment} />
          </View>
        </View>
      </Modal>
      <Button title="Çıkış Yap" onPress={handleSignOut} />
    </View>
  );
};

const TimeList = ({ handleHourSelect, reservationTimes }) => {
  const hours = {};
  for (let i = 8; i <= 20; i++) {
    const timeString = `${i.toString().padStart(2, '0')}:00`;
    hours[timeString] = reservationTimes.includes(timeString) ? 1 : 0;
  }

  return (
    <FlatList
      data={Object.keys(hours)}
      renderItem={({ item }) => {
        const isReserved = hours[item] === 1;
        return (
          <TouchableOpacity
            style={[styles.timeButton, isReserved && styles.timeButtonReserved]}
            onPress={() => !isReserved && handleHourSelect(item)}
            disabled={isReserved}
          >
            <Text style={styles.timeText}>{item}</Text>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.timeList}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateBox: {
    width: 180,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 16
  },
  timeContainer: {
    flex: 1,
    width: '100%',
  },
  timeList: {
    alignItems: 'center',
  },
  timeButton: {
    width: 120,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: '#0099cc',
    marginVertical: 5,
  },
  timeButtonReserved: {
    backgroundColor: 'grey',
  },
  timeText: {
    fontSize: 18,
    color: 'white',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default MainScreen;

