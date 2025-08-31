import axios from 'axios';
import { API_BASE_URL } from '../config/appConfig';

class DetailedAnalysisService {
    
    /**
     * Get detailed analysis for skin condition results
     */
    async getDetailedAnalysis(imageUri, resultData) {
        try {
            // Check if detailed analysis is already available in the result
            if (resultData?.result?.detailed_analysis) {
                return {
                    success: true,
                    detailedSections: this.formatDetailedSections(resultData.result.detailed_analysis),
                    condition: resultData.result.disease,
                    confidence: resultData.result.probability
                };
            }

            // If no detailed analysis in result, it means backend didn't include it
            // Return basic formatted sections
            return {
                success: true,
                detailedSections: this.getBasicSections(resultData.result),
                condition: resultData.result.disease,
                confidence: resultData.result.probability
            };

        } catch (error) {
            console.error('Error getting detailed analysis:', error);
            return {
                success: false,
                error: error.message,
                detailedSections: this.getFallbackSections()
            };
        }
    }

    /**
     * Format the detailed analysis from OpenAI into sections
     */
    formatDetailedSections(detailedAnalysis) {
        return {
            'Overview': detailedAnalysis.overview || 'Analysis not available',
            'Detection Details': detailedAnalysis.detection_details || 'Detection details not available',
            'Recommendations': detailedAnalysis.recommendations || 'Recommendations not available',
            'Important Notes': detailedAnalysis.important_notes || 'Important notes not available',
            'Next Steps': detailedAnalysis.next_steps || 'Next steps not available'
        };
    }

    /**
     * Create basic sections from the original result data
     */
    getBasicSections(resultData) {
        const { disease, overview, symptoms, causes, treatments, probability } = resultData;
        
        return {
            'Overview': overview || `Detected condition: ${disease}. This analysis is based on AI pattern recognition and should be confirmed by a healthcare professional.`,
            
            'Detection Details': `
Detected Condition: ${disease}
Confidence Level: ${(probability * 100).toFixed(1)}%

Identified Symptoms:
${symptoms?.map((symptom, index) => `• ${symptom}`).join('\n') || '• No specific symptoms identified'}

Note: This is an AI-powered analysis and should not replace professional medical diagnosis.`,

            'Recommendations': `
Suggested Treatments:
${treatments?.map((treatment, index) => `• ${treatment}`).join('\n') || '• Consult a healthcare professional for treatment options'}

General Care:
• Keep the affected area clean and dry
• Avoid harsh soaps or irritating products
• Monitor for changes in appearance`,

            'Important Notes': `
• This analysis is provided by AI technology and is for informational purposes only
• Results should not be used as a substitute for professional medical advice
• If you have concerns about your skin, please consult a healthcare provider
• The confidence level indicates the AI's certainty, not the severity of any condition

Possible Causes:
${causes?.map((cause, index) => `• ${cause}`).join('\n') || '• Multiple factors may contribute to skin conditions'}`,

            'Next Steps': `
1. Save or screenshot these results for your records
2. Schedule an appointment with a dermatologist or healthcare provider
3. Monitor the affected area for any changes
4. Keep the area clean and avoid irritating products
5. Consider taking additional photos to track changes over time

Urgency Level: ${this.getUrgencyLevel(disease)}`
        };
    }

    /**
     * Get urgency level based on condition
     */
    getUrgencyLevel(condition) {
        const urgentConditions = ['melanoma', 'cancer', 'malignant'];
        const moderateConditions = ['psoriasis', 'eczema', 'dermatitis'];
        
        const conditionLower = condition.toLowerCase();
        
        if (urgentConditions.some(urgent => conditionLower.includes(urgent))) {
            return 'URGENT: Seek immediate medical attention';
        } else if (moderateConditions.some(moderate => conditionLower.includes(moderate))) {
            return 'Moderate: Schedule appointment within 1-2 weeks';
        } else {
            return 'Low: Schedule routine consultation';
        }
    }

    /**
     * Fallback sections when everything fails
     */
    getFallbackSections() {
        return {
            'Overview': 'Unable to generate detailed analysis at this time. Please consult a healthcare professional for proper evaluation.',
            'Detection Details': 'Analysis details are not available. This may be due to image quality or technical issues.',
            'Recommendations': 'General recommendation: Consult with a dermatologist or healthcare provider for proper diagnosis and treatment.',
            'Important Notes': '⚠️ Always consult a qualified healthcare provider for medical advice. AI analysis should not be used for self-diagnosis.',
            'Next Steps': '1. Schedule an appointment with a healthcare provider\n2. Bring the original image for professional evaluation\n3. Monitor the area for any changes'
        };
    }
}

export default new DetailedAnalysisService();
