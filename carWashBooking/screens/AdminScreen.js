import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

const AdminScreen = () => {
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('requests');

  useEffect(() => {
    if (selectedTab === 'requests') {
      fetch('http://192.168.1.23:3000/unaccepted-reservations')
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
      fetch('http://192.168.1.23:3000/accepted-reservations')
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
    fetch(`http://192.168.1.23:3000/reservations/${id}/accept`, {
      method: 'PUT',
    })
      .then((response) => {
        if (response.ok) {
          fetch('http://192.168.1.23:3000/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservation_id: id }),
          })
            .then((emailResponse) => {
              if (emailResponse.ok) {
                setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
                Alert.alert('Success', 'Request accepted and email sent successfully');
              } else {
                Alert.alert('Error', 'Request accepted but email not sent');
              }
            })
            .catch((emailError) => console.error('Error sending email:', emailError));
        } else {
          Alert.alert('Error', 'Error accepting request');
        }
      })
      .catch((error) => console.error('Error accepting request:', error));
  };
  

  const handleReject = (id) => {
    fetch(`http://192.168.1.23:3000/reservations/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
          Alert.alert('Success', 'Request rejected successfully');
        }
      })
      .catch((error) => console.error('Error rejecting request:', error));
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.itemContainer}>
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
    <View style={styles.itemContainer}>
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
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeNavButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'green',
  },
  activeNavButtonText: {
    color: 'green',
  },
});

export default AdminScreen;
