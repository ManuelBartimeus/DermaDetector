import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import Header from '../components/Header';

const CaseScreen = () => {
    // Placeholder for case data
    const cases = [];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Case History</Text>
                <Text style={styles.subtitle}>Track previous skin condition checks</Text>
            </View>

            <View style={styles.content}>
                {cases.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Image
                            source={require('../../assets/images/onboarding.png')} // Replace with your own icon
                            style={styles.icon}
                        />
                        <Text style={styles.emptyText}>No cases added yet</Text>
                    </View>
                ) : (
                    <Text>Cases will show here.</Text> // Replace with mapped case cards
                )}
            </View>

            //bottom navigation<View style={styles.tabBar}>
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
    container: {
        flex: 1,
        backgroundColor: '#eaf6ff', // lightest blue
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 24,
        backgroundColor: '#cce4ff', // mid blue
        paddingBottom: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#336699',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyState: {
        alignItems: 'center',
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 20,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 18,
        color: '#003366',
        fontStyle: 'italic',
    },
    bottomButtonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#cce4ff', // mid blue
        borderTopWidth: 1,
        borderColor: '#b0c4de', // light blue
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        color: '#003366',
    },
});

export default CaseScreen;
