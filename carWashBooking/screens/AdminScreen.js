import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

const AdminScreen = () => {
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('requests');

  useEffect(() => {
    if (selectedTab === 'requests') {
      fetch('http://192.168.1.22:3000/unaccepted-reservations')
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const formattedData = data.map(item => ({
              ...item,
              formattedDate: new Date(item.reservation_date).toISOString().split('T')[0] + ' ' + item.reservation_time
            }));
            setRequests(formattedData);
          }
        })
        .catch((error) => console.error('Error fetching unaccepted reservations:', error));
    } else if (selectedTab === 'appointments') {
      fetch('http://192.168.1.22:3000/accepted-reservations')
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const formattedData = data.map(item => ({
              ...item,
              formattedDate: new Date(item.reservation_date).toISOString().split('T')[0] + ' ' + item.reservation_time
            }));
            setAppointments(formattedData);
          }
        })
        .catch((error) => console.error('Error fetching accepted reservations:', error));
    }
  }, [selectedTab]);

  const handleAccept = (id) => {
    fetch(`http://192.168.1.22:3000/reservations/${id}/accept`, {
      method: 'PUT',
    })
      .then((response) => {
        if (response.ok) {
          fetch('http://192.168.1.22:3000/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservation_id: id }),
          })
            .then((emailResponse) => {
              if (emailResponse.ok) {
                setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
                Alert.alert('Başarılı', 'İstek kabul edildi ve e-posta başarıyla gönderildi');
              } else {
                Alert.alert('Hata', 'İstek kabul edildi ancak e-posta gönderilemedi');
              }
            })
            .catch((emailError) => console.error('Error sending email:', emailError));
        } else {
          Alert.alert('Hata', 'İstek kabul edilirken hata oluştu');
        }
      })
      .catch((error) => console.error('Error accepting request:', error));
  };
  

  const handleReject = (id) => {
    fetch(`http://192.168.1.22:3000/reservations/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
          Alert.alert('Başarılı', 'İstek başarıyla reddedildi');
        }
      })
      .catch((error) => console.error('Error rejecting request:', error));
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemText}>{item.formattedDate}</Text>
      <Text style={styles.itemText}>{item.name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(item.id)}>
          <Text style={styles.buttonText}>Onayla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item.id)}>
          <Text style={styles.buttonText}>Reddet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemText}>{item.formattedDate}</Text>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {selectedTab === 'requests' ? (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.navButton, selectedTab === 'requests' ? styles.activeNavButton : null]}
          onPress={() => setSelectedTab('requests')}
        >
          <Text style={[styles.navButtonText, selectedTab === 'requests' ? styles.activeNavButtonText : null]}>
            İstekler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, selectedTab === 'appointments' ? styles.activeNavButton : null]}
          onPress={() => setSelectedTab('appointments')}
        >
          <Text style={[styles.navButtonText, selectedTab === 'appointments' ? styles.activeNavButtonText : null]}>
            Randevular
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fc',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#9999e6', // Açık mavi renk
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center', // Metni ortala
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    width: '48%',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4caf50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  activeNavButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#9999e6',
  },
  activeNavButtonText: {
    color: '#9999e6',
  },
});

export default AdminScreen;

