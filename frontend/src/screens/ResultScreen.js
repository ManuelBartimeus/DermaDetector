import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Header from '../components/Header';
import { getSeverityColor, formatConfidence } from '../utils/helpers';
import { useCases } from '../context/CasesContext';
import detailedAnalysisService from '../services/detailedAnalysisService';

const ResultScreen = ({ route, navigation }) => {
    const { imageUri, resultData } = route.params;

    // Extract results from the API response
    const { result } = resultData;
    const { disease, probability, detailed_analysis } = result;

    const [activeSection, setActiveSection] = useState('Overview');
    const [sectionContent, setSectionContent] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [analysisError, setAnalysisError] = useState(null);

    const sections = [
        'Overview',
        'Detection Details',
        'Recommendations',
        'Important Notes',
        'Next Steps',
    ];

    // Load detailed analysis on component mount
    useEffect(() => {
        loadDetailedAnalysis();
    }, []);

    const loadDetailedAnalysis = async () => {
        try {
            setIsLoading(true);
            const analysis = await detailedAnalysisService.getDetailedAnalysis(imageUri, resultData);
            
            if (analysis.success) {
                setSectionContent(analysis.detailedSections);
            } else {
                setAnalysisError(analysis.error);
                // Use fallback content
                setSectionContent(detailedAnalysisService.getFallbackSections());
            }
        } catch (error) {
            console.error('Error loading detailed analysis:', error);
            setAnalysisError(error.message);
            setSectionContent(detailedAnalysisService.getFallbackSections());
        } finally {
            setIsLoading(false);
        }
    };

    const { addCase } = useCases();

    const handleNext = () => {
        navigation.navigate('Home');
    };

    // Modified handleDone to show popup before navigating
    const handleDone = () => {
        addCase({
            condition: disease,
            confidence: probability,
            advice: result.treatments?.join(', ') || 'Consult healthcare professional',
            date: new Date().toLocaleString(),
            imageUri,
        });
        Alert.alert(
            "Find Dermatology Hospitals",
            "Would you like to see dermatology hospitals around that can help treat your case?",
            [
                {
                    text: "No",
                    onPress: () => navigation.navigate('Cases'),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => navigation.navigate('Hospitals', { condition: disease })
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Results" showDoneButton={true} onDone={handleDone} />
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>

                {/* Disease Name & Confidence */}
                <View style={styles.resultHeader}>
                    <Text style={[styles.condition, { color: getSeverityColor(disease) }]}>
                        {disease}
                    </Text>
                    <View style={styles.confidenceBox}>
                        <Text style={styles.confidenceLabel}>Confidence Level</Text>
                        <Text style={styles.confidenceValue}>{formatConfidence(probability)}</Text>
                    </View>
                </View>

                {/* Medical Disclaimer */}
                <View style={styles.disclaimerBanner}>
                    <Text style={styles.disclaimerText}>
                        ⚠️ This is an AI analysis for informational purposes only. Always consult a healthcare professional for medical advice.
                    </Text>
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    {sections.map((section) => (
                        <TouchableOpacity
                            key={section}
                            style={[
                                styles.tabButton,
                                activeSection === section && styles.activeTabButton,
                            ]}
                            onPress={() => setActiveSection(section)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeSection === section && styles.activeTabText,
                                ]}
                            >
                                {section}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Active Content */}
                <View style={styles.contentBox}>
                    <Text style={styles.sectionTitle}>{activeSection}</Text>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#005a9c" />
                            <Text style={styles.loadingText}>Generating detailed analysis...</Text>
                        </View>
                    ) : analysisError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>⚠️ Unable to load detailed analysis</Text>
                            <Text style={styles.sectionContent}>
                                {sectionContent[activeSection] || 'Content not available'}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.sectionContent}>
                            {sectionContent[activeSection] || 'Content not available'}
                        </Text>
                    )}
                </View>

                {/* New Analysis Button */}
                <TouchableOpacity style={styles.newAnalysisButton} onPress={handleNext}>
                    <Text style={styles.newAnalysisButtonText}>New Analysis</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom Tab Navigation */}
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
    container: {
        flex: 1,
        backgroundColor: '#f8fbff', // subtle blue background for distinction
    },
    scroll: {
        paddingBottom: 24,
        paddingHorizontal: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 8,
    },
    image: {
        width: 220,
        height: 220,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#005a9c',
        backgroundColor: '#e6f0fa',
    },
    resultHeader: {
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    condition: {
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'capitalize',
        marginBottom: 4,
    },
    confidenceBox: {
        backgroundColor: '#e6f0fa',
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginBottom: 2,
    },
    confidenceLabel: {
        fontSize: 13,
        color: '#005a9c',
        textAlign: 'center',
        fontWeight: '600',
    },
    confidenceValue: {
        fontSize: 18,
        color: '#003366',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    advice: {
        fontSize: 16,
        color: '#222',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: 8,
        gap: 4,
    },
    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#d0e6ff',
        borderRadius: 20,
        marginHorizontal: 2,
        marginVertical: 2,
    },
    activeTabButton: {
        backgroundColor: '#005a9c',
    },
    tabText: {
        color: '#003366',
        fontSize: 14,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    contentBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginTop: 6,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#005a9c',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#005a9c',
        marginBottom: 4,
    },
    sectionContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 21,
    },
    newAnalysisButton: {
        backgroundColor: '#005a9c',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 14,
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 2,
    },
    newAnalysisButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimerBanner: {
        backgroundColor: '#fff3cd',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#f57c00',
    },
    disclaimerText: {
        fontSize: 13,
        color: '#856404',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        backgroundColor: '#cce4ff',
        borderTopWidth: 1,
        borderColor: '#b0c4de',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        color: '#003366',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#005a9c',
        fontStyle: 'italic',
    },
    errorContainer: {
        paddingVertical: 10,
    },
    errorText: {
        fontSize: 14,
        color: '#d32f2f',
        marginBottom: 8,
        fontWeight: 'bold',
    },
});

export default ResultScreen;
