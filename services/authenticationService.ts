import OpenAI from 'openai';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { store } from '@/store/store';
import { addSearch } from '@/store/pastSearchesSlice';
import uuid from 'react-native-uuid';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.openaiApiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

export interface AuthenticationResult {
  authenticityScore: number;
  reasons: string[];
  suggestedRetailPrice: number;
  brandModel: string;
  confidenceLevel: string;
}

export async function authenticateBag(imageUri: string): Promise<AuthenticationResult> {
  try {
    // Convert local URI to base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [{
        role: "user",
        content: [
          {
            type: "input_text",
            text: "You are a world-renowned expert specializing in authentication of luxury designer handbags with 30+ years of experience. Your reputation depends on accurate assessments. Analyze this image with extreme scrutiny and skepticism, as most bags submitted are counterfeit."
          },
          {
            type: "input_text",
            text: "**Analysis Steps:**"
          },
          {
            type: "input_text",
            text: "1. Identify the specific brand, model, and size of the handbag"
          },
          {
            type: "input_text",
            text: "2. Examine critically:"
          },
          {
            type: "input_text", 
            text: "   - Stitching: Must be perfectly even, straight, and consistent throughout"
          },
          {
            type: "input_text",
            text: "   - Hardware: Must have correct weight, finish, engravings, and precise alignment"
          },
          {
            type: "input_text",
            text: "   - Logos & Branding: Must have exact font, spacing, and placement"
          },
          {
            type: "input_text",
            text: "   - Materials: Must match exact texture, grain, and quality of authentic examples"
          },
          {
            type: "input_text",
            text: "   - Construction: Must have perfect symmetry and correct proportions"
          },
          {
            type: "input_text",
            text: "   - Interior: Examine lining, date/serial codes, and authentication markers"
          },
          {
            type: "input_text",
            text: "3. Address common counterfeits: List specific red flags for this particular model"
          },
          {
            type: "input_text",
            text: "4. Be conservative: When in doubt, rate authenticity lower rather than higher"
          },
          {
            type: "input_text",
            text: "**Response Format (JSON ONLY - no markdown, no asterisks):**"
          },
          {
            type: "input_text",
            text: "```json\n{\n  \"brandModel\": \"Brand Name Model Name\",\n  \"authenticityScore\": 85,\n  \"confidenceLevel\": \"High/Medium/Low\",\n  \"keyReasons\": [\n    \"Precise observation about an authenticity indicator\",\n    \"Another specific observation\"\n  ],\n  \"suggestedRetailPrice\": 250\n}\n```"
          },
          {
            type: "input_text",
            text: "Return ONLY valid JSON with no explanation text before or after. Your response must be parseable by JSON.parse()."
          },
          {
            type: "input_image",
            image_url: `data:image/jpeg;base64,${base64Image}`,
            detail: "high"
          }
        ]
      }]
    });

    const content = response.output_text;
    
    if (!content) {
      throw new Error('No response from the AI model');
    }
    
    // Clean the response - remove any non-JSON content
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Could not find valid JSON in the response');
    }
    
    const cleanJson = content.substring(jsonStart, jsonEnd);
    
    try {
      // Parse the JSON response
      const jsonResponse = JSON.parse(cleanJson);
      
      const result = {
        authenticityScore: jsonResponse.authenticityScore || 0,
        reasons: jsonResponse.keyReasons || ['Analysis incomplete'],
        suggestedRetailPrice: jsonResponse.suggestedRetailPrice || 0,
        brandModel: jsonResponse.brandModel || 'Unknown',
        confidenceLevel: jsonResponse.confidenceLevel || 'Low'
      };

      // Save to Redux store and Supabase as before
      const searchRecord = {
        id: uuid.v4() as string,
        query: 'Bag Authentication',
        result: JSON.stringify(result),
        timestamp: Date.now()
      };

      store.dispatch(addSearch(searchRecord));
      await supabase.from('past_searches').insert([searchRecord]);

      return result;
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError, 'Content:', cleanJson);
      
      // Fallback to regex parsing if JSON parsing fails
      const scoreMatch = content.match(/(\d+)/);
      const authenticityScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      
      const priceMatch = content.match(/\$[\d,]+/);
      const suggestedRetailPrice = priceMatch ? parseInt(priceMatch[0].replace(/[$,]/g, '')) : 0;
      
      const result = {
        authenticityScore,
        reasons: ['Could not parse AI response properly'],
        suggestedRetailPrice,
        brandModel: 'Unknown',
        confidenceLevel: 'Low'
      };
      
      return result;
    }
  } catch (error) {
    console.error('Error authenticating bag:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to authenticate bag');
  }
}