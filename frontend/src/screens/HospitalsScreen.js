import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Linking,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

// Expanded hospitals list (real centers + samples)
const hospitals = [
    {
        id: '1',
        name: 'Skin Health Dermatology Center',
        address: '12 Ridge Road, Accra',
        phone: '+233202345678',
        status: 'Open Now',
        hours: 'Mon-Fri 8am–6pm, Sat 9am–2pm',
        location: { latitude: 5.5600, longitude: -0.2050 },
    },
    {
        id: '2',
        name: 'DermaCure Specialist Hospital',
        address: '45 Spintex Street, Accra',
        phone: '+233545678901',
        status: 'Closed',
        hours: 'Mon-Fri 9am–5pm',
        location: { latitude: 5.6396, longitude: -0.0731 },
    },
    {
        id: '3',
        name: 'Glow Skin & Hair Clinic',
        address: '22 East Legon Avenue, Accra',
        phone: '+233268899990',
        status: 'Open Now',
        hours: 'Mon-Sat 8am–7pm',
        location: { latitude: 5.6404, longitude: -0.1553 },
    },
    {
        id: '4',
        name: 'Korle Bu Teaching Hospital – Dermatology Dept.',
        address: 'Guggisberg Ave, Accra',
        phone: '+233302674123',
        status: 'Open Now',
        hours: 'Mon-Fri 8am–4pm',
        location: { latitude: 5.5433, longitude: -0.2465 },
    },
    {
        id: '5',
        name: '37 Military Hospital – Skin Clinic',
        address: 'Liberation Road, Accra',
        phone: '+233302776111',
        status: 'Closed',
        hours: 'Mon-Fri 8am–3pm',
        location: { latitude: 5.5830, longitude: -0.1866 },
    },
    {
        id: '6',
        name: 'Komfo Anokye Teaching Hospital – Dermatology Dept.',
        address: 'Off Lake Road, Kumasi',
        phone: '+233322083000',
        status: 'Open Now',
        hours: 'Mon-Fri 8am–4pm',
        location: { latitude: 6.6951, longitude: -1.6308 },
    },
];

// Distance calculation function
const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (val) => (val * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const HospitalsScreen = () => {
    const [location, setLocation] = useState(null);
    const [hospitalsWithDistance, setHospitalsWithDistance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [newHospital, setNewHospital] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to view distances.');
                setLoading(false);
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);

            const hospitalsWithDist = hospitals.map((hosp) => ({
                ...hosp,
                distance: getDistance(
                    userLocation.coords.latitude,
                    userLocation.coords.longitude,
                    hosp.location.latitude,
                    hosp.location.longitude
                ),
            }));

            hospitalsWithDist.sort((a, b) => a.distance - b.distance);
            setHospitalsWithDistance(hospitalsWithDist);
            setLoading(false);
        })();
    }, []);

    // Call button
    const handleCall = (phone) => {
        Linking.openURL(`tel:${phone}`);
    };

    // Directions button
    const handleGetDirections = (destination) => {
        if (!location) {
            Alert.alert('Location Not Found', 'Please allow location access first.');
            return;
        }
        const origin = `${location.latitude},${location.longitude}`;
        const dest = `${destination.latitude},${destination.longitude}`;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
        Linking.openURL(url);
    };

    // Community recommendation handler
    const handleAddRecommendation = () => {
        if (!newHospital.trim()) {
            Alert.alert('Input Required', 'Please enter the hospital/clinic name.');
            return;
        }
        setRecommendations([...recommendations, { id: Date.now().toString(), name: newHospital }]);
        setNewHospital('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Dermatology Hospitals Nearby" navigation={navigation} />

            {loading ? (
                <ActivityIndicator size="large" color="#004080" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={hospitalsWithDistance}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.address}>{item.address}</Text>
                            <Text style={styles.distance}>
                                Distance: {item.distance.toFixed(2)} km
                            </Text>
                            <Text style={styles.hours}>{item.hours}</Text>
                            <Text
                                style={[
                                    styles.status,
                                    { color: item.status === 'Open Now' ? '#00aa00' : '#cc0000' },
                                ]}
                            >
                                {item.status}
                            </Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    onPress={() => handleCall(item.phone)}
                                    style={styles.callButton}
                                >
                                    <Text style={styles.callText}>Call</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleGetDirections(item.location)}
                                    style={styles.directionsButton}
                                >
                                    <Text style={styles.callText}>Get Directions</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Community Recommendation Section */}
            <View style={styles.recommendationBox}>
                <Text style={styles.subHeader}>Community Recommendations</Text>
                <FlatList
                    data={recommendations}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Text style={styles.recommendationItem}>• {item.name}</Text>
                    )}
                />
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="Suggest a hospital/clinic..."
                        value={newHospital}
                        onChangeText={setNewHospital}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddRecommendation}>
                        <Text style={styles.addText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.tabText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Cases')}>
                    <Text style={styles.tabText}>My Cases</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#eaf4ff' },
    list: { paddingHorizontal: 16, paddingBottom: 20 },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        elevation: 3,
        marginTop: 10,
    },
    name: { fontSize: 18, fontWeight: '600', color: '#004080', marginBottom: 6 },
    address: { fontSize: 14, color: '#555', marginBottom: 4 },
    distance: { fontSize: 14, color: '#0073e6', marginBottom: 4 },
    hours: { fontSize: 13, fontStyle: 'italic', color: '#444', marginBottom: 4 },
    status: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    directionsButton: {
        backgroundColor: '#00b300',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginLeft: 10,
    },
    callButton: {
        backgroundColor: '#0073e6',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    callText: { color: '#fff', fontWeight: '600' },
    recommendationBox: {
        padding: 16,
        backgroundColor: '#f5faff',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    subHeader: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#003366' },
    recommendationItem: { fontSize: 14, color: '#333', marginBottom: 4 },
    inputRow: { flexDirection: 'row', marginTop: 10 },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    addButton: {
        marginLeft: 10,
        backgroundColor: '#004080',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    addText: { color: '#fff', fontWeight: '600' },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#cce4ff',
        borderTopWidth: 1,
        borderColor: '#b0c4de',
    },
    tabItem: { flex: 1, alignItems: 'center' },
    tabText: { fontSize: 16, color: '#003366' },
});

export default HospitalsScreen;
