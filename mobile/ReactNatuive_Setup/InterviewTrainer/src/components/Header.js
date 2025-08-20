import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ onNavigate }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateTo = (screen) => {
    onNavigate(screen);
    setMenuVisible(false);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Interview Trainer</Text>
      <TouchableOpacity onPress={toggleMenu}>
        <Text style={styles.menuIcon}>≡</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('home')}
            >
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('resume')}
            >
              <Text style={styles.menuText}>Resume Analyzer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('usecases')}
            >
              <Text style={styles.menuText}>Use Cases</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('interview')}
            >
              <Text style={styles.menuText}>Interview Analyzer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('Home')}
            >
              <Text style={styles.menuText}>Home Page</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('SignUp')}
            >
              <Text style={styles.menuText}>SignUp</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('SignIn')}
            >
              <Text style={styles.menuText}>SignIn</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('GoogleLogin')}
            >
              <Text style={styles.menuText}>Google Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('Profile')}
            >
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('OtpCheck')}
            >
              <Text style={styles.menuText}>OTP Check</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => navigateTo('AfterInterview')}
            >
              <Text style={styles.menuText}>After Interview</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 200,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 16,
  },
});

export default Header;