import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import Header from '../components/Header';
import { getSeverityColor, formatConfidence } from '../utils/helpers';
import { useCases } from '../context/CasesContext';

const ResultScreen = ({ route, navigation }) => {
    const { imageUri, resultData } = route.params;

    // Extract results from the Roboflow API response
    const { result } = resultData;
    const { condition, confidence, advice, detections = [], raw_response } = result;

    const [activeSection, setActiveSection] = useState('Overview');

    const sections = [
        'Overview',
        'Detection Details',
        'Recommendations',
        'Important Notes',
        'Next Steps',
    ];

    // Generate dynamic content based on API results
    const getConditionInfo = (conditionName) => {
        const conditionLower = conditionName.toLowerCase();
        const conditionData = {
            'acne': {
                overview: 'Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It commonly appears on the face, chest, and back.',
                urgency: 'Generally not urgent unless severe or causing scarring. Mild to moderate acne can often be managed with over-the-counter treatments.',
                care: 'Wash affected areas gently twice daily with a mild cleanser. Avoid picking or squeezing lesions.'
            },
            'eczema': {
                overview: 'Eczema (atopic dermatitis) is a chronic inflammatory skin condition that causes dry, itchy, and inflamed skin.',
                urgency: 'Usually not urgent, but see a doctor if symptoms are severe or interfering with daily activities.',
                care: 'Keep skin moisturized, avoid known triggers, use gentle fragrance-free products.'
            },
            'psoriasis': {
                overview: 'Psoriasis is a chronic autoimmune condition that causes rapid skin cell buildup, resulting in scaling and inflammation.',
                urgency: 'Chronic condition requiring medical management. See a dermatologist for proper treatment plan.',
                care: 'Follow prescribed treatments, avoid triggers, maintain good skin care routine.'
            },
            'melanoma': {
                overview: 'Melanoma is a serious form of skin cancer that develops in melanocytes (pigment-producing cells).',
                urgency: 'URGENT: Requires immediate medical attention. Please see a dermatologist or healthcare provider as soon as possible.',
                care: 'Do not delay medical consultation. Protect the area from further sun exposure.'
            },
            'rosacea': {
                overview: 'Rosacea is a chronic inflammatory skin condition that primarily affects the face, causing redness and visible blood vessels.',
                urgency: 'Not urgent but benefits from medical treatment to prevent progression.',
                care: 'Avoid known triggers (spicy foods, alcohol, sun exposure), use gentle skincare products.'
            }
        };

        // Default information for unknown conditions
        const defaultInfo = {
            overview: `Preliminary AI analysis suggests the skin condition is likely: ${conditionName}. This evaluation is based on visual patterns and should not be treated as a confirmed medical diagnosis. For your safety and well-being, always consult a licensed healthcare professional for accurate identification and treatment.`,

            urgency: `It is recommended that you seek medical attention to confirm the diagnosis and receive personalized treatment. Early consultation can help prevent worsening or complications, especially if symptoms persist or spread.`,

            care: `In the meantime, maintain gentle skin care by keeping the area clean and dry. Avoid scratching, applying unverified creams, or using harsh soaps. Monitor for changes in size, color, or irritation, and document them if possible to assist a healthcare provider.`

        };

        return conditionData[conditionLower] || defaultInfo;
    };

    const conditionInfo = getConditionInfo(condition);

    const sectionContent = {
        'Overview': conditionInfo.overview,

        'Detection Details': `
Detected Condition: ${condition}
Confidence Level: ${confidence}

${detections.length > 0 ? `
Additional Detections:
${detections.slice(0, 3).map((detection, index) =>
            `${index + 1}. ${detection.class} (${Math.round(detection.confidence * 100)}%)`
        ).join('\n')}
` : ''}

Note: This is an AI-powered analysis and should not replace professional medical diagnosis.`,

        'Recommendations': advice,

        'Important Notes': `
• This analysis is provided by AI technology and is for informational purposes only
• Results should not be used as a substitute for professional medical advice
• If you have concerns about your skin, please consult a healthcare provider
• The confidence level indicates the AI's certainty, not the severity of any condition`,

        'Next Steps': `
1. Save or screenshot these results for your records
2. ${conditionInfo.urgency}
3. Monitor the affected area for any changes
4. ${conditionInfo.care}
5. Consider taking additional photos to track changes over time`
    };

    const { addCase } = useCases();

    const handleNext = () => {
        navigation.navigate('Home');
    };

    // Modified handleDone to show popup before navigating
    const handleDone = () => {
        addCase({
            condition,
            confidence,
            advice,
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
                    onPress: () => navigation.navigate('Hospitals', { condition })
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
                    <Text style={[styles.condition, { color: getSeverityColor(condition) }]}>
                        {condition}
                    </Text>
                    <View style={styles.confidenceBox}>
                        <Text style={styles.confidenceLabel}>Confidence Level</Text>
                        <Text style={styles.confidenceValue}>{formatConfidence(confidence)}</Text>
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
                    <Text style={styles.sectionContent}>{sectionContent[activeSection]}</Text>
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
});

export default ResultScreen;
