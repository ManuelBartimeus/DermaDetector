import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { useCases } from '../context/CasesContext';
import Header from '../components/Header';

const CasesScreen = ({ navigation }) => {
    const { cases } = useCases();

    const handleCasePress = (item) => {
        // Navigate to ResultScreen with the case details
        navigation.navigate('Result', {
            imageUri: item.imageUri,
            resultData: {
                result: {
                    condition: item.condition,
                    confidence: item.confidence,
                    advice: item.advice,
                    detections: item.detections || [],
                    raw_response: item.raw_response || {},
                }
            }
        });
    };

    const renderCase = ({ item }) => (
        <TouchableOpacity onPress={() => handleCasePress(item)} activeOpacity={0.8}>
            <View style={styles.caseRow}>
                <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
                <View style={styles.caseDetails}>
                    <Text style={styles.caseTitle} numberOfLines={1}>
                        {item.condition || 'Unknown Case'}
                    </Text>
                    <Text style={styles.caseMeta}>
                        {item.date || 'Unknown Date'} {item.fileSize ? `- ${item.fileSize}` : ''}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Cases" titleStyle={{ textAlign: 'center', color: '#005a9c' }} />

            <FlatList
                data={cases}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderCase}
                ListEmptyComponent={<Text style={styles.emptyText}>No cases yet.</Text>}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.tabBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.tabText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={[styles.tabText, styles.activeTab]}>My Cases</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdfdfdff', // Matches other pages' background
    },
    listContent: {
        padding: 16,
    },
    caseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
    },
    thumbnail: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: '#a6bcd2ff',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#0d609bff',
    },
    caseDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    caseTitle: {
        fontSize: 16,
        color: '#75afd9ff',
        fontWeight: 'bold',
        marginBottom: 2,
        textTransform: 'capitalize',
        borderColor: '#2b628aff'
    },
    caseMeta: {
        fontSize: 14,
        color: '#333',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 60,
        fontSize: 16,
        color: '#888',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 14,
        borderTopWidth: 0.5,
        borderColor: '#b0c4de',
        backgroundColor: '#cce4ff',
    },
    tabText: {
        color: '#003366',
        fontSize: 15,
    },
    activeTab: {
        fontWeight: 'bold',
        color: '#005a9c',
        textDecorationLine: 'underline',
    },
});

export default CasesScreen;
