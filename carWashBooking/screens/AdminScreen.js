import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const AdminScreen = () => {
  const [requests, setRequests] = useState([
    { id: 1, name: "Alice Smith", date: "29 Mayıs 14:00" },
    { id: 2, name: "Bob Johnson", date: "30 Mayıs 15:30" },
    { id: 3, name: "Charlie Brown", date: "31 Mayıs 16:45" },
  ]);

  const [appointments, setAppointments] = useState([
    { id: 1, name: "John Doe", date: "1 Haziran 10:00" },
    { id: 2, name: "Jane Smith", date: "2 Haziran 11:30" },
    { id: 3, name: "Michael Johnson", date: "3 Haziran 13:15" },
  ]);

  const handleAccept = (id) => {
    // Accept logic
  };

  const handleReject = (id) => {
    // Reject logic
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.date}</Text>
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
      <Text style={styles.itemText}>{item.date}</Text>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  const [selectedTab, setSelectedTab] = useState('requests');

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
