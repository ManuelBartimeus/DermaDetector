import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Button,
} from 'react-native';
import Header from '../components/Header';
import { getSeverityColor, formatConfidence } from '../utils/helpers';

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
        
        // Condition-specific information
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
            overview: `The analysis detected: ${conditionName}. This is an AI-generated assessment and should not replace professional medical diagnosis.`,
            urgency: 'Consult a healthcare professional for proper evaluation and treatment recommendations.',
            care: 'Follow general skin care practices and avoid irritating the affected area.'
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

    const handleNext = () => {
        // Navigate back to home or to cases screen
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Results" />
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Image */}
                <Image source={{ uri: imageUri }} style={styles.image} />

                {/* Header */}
                <Text style={[styles.condition, { color: getSeverityColor(condition) }]}>{condition}</Text>
                <Text style={styles.confidence}>Confidence: {formatConfidence(confidence)}</Text>
                <Text style={styles.advice}>{advice}</Text>

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
        backgroundColor: '#fff', // white background
    },
    scroll: {
        paddingBottom: 40,
        paddingHorizontal: 16,
    },
    image: {
        width: '100%',
        height: 280,
        borderRadius: 12,
        marginVertical: 10,
    },
    condition: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
        marginTop: 10,
    },
    confidence: {
        fontSize: 16,
        color: '#005a9c',
        marginVertical: 4,
    },
    advice: {
        fontSize: 16,
        color: '#222',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#d0e6ff',
        borderRadius: 20,
        margin: 4,
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
        padding: 16,
        marginTop: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#005a9c',
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    cancelButton: {
        padding: 8,
    },
    cancelText: {
        color: '#d00',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomButtonContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    nextButton: {
        backgroundColor: '#005a9c',
        borderRadius: 8,
        paddingVertical: 12,
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
    newAnalysisButton: {
        backgroundColor: '#005a9c',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 20,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    newAnalysisButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimerBanner: {
        backgroundColor: '#fff3cd',
        borderRadius: 8,
        padding: 12,
        marginVertical: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#f57c00',
    },
    disclaimerText: {
        fontSize: 14,
        color: '#856404',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
export default ResultScreen;
