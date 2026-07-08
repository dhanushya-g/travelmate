import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { placeName, destination } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a knowledgeable historian and travel expert. Generate detailed historical information about tourist places and landmarks. Always provide accurate, educational, and engaging content.

Return your response as a valid JSON object with this exact structure:
{
  "title": "Brief compelling title about the place's history",
  "timeline": "Time period (e.g., 'Built in 1632 CE' or '3rd Century BCE')",
  "description": "2-3 paragraphs of detailed historical description covering origins, significance, and interesting facts",
  "keyFacts": ["Array of 4-5 key historical facts about the place"],
  "images": [
    {"url": "https://upload.wikimedia.org/wikipedia/commons/...", "caption": "Description of image"}
  ],
  "videos": [
    {"url": "https://www.youtube.com/results?search_query=[place-name]+history+documentary", "title": "Watch documentaries about [place name]"}
  ]
}

For images, use real Wikipedia Commons image URLs for the specific place. Search for actual historical images of the landmark.
For videos, provide YouTube search links for historical documentaries about the place.`;

    const userPrompt = `Generate comprehensive historical information about "${placeName}" located in or near ${destination}. Include its origins, historical significance, architectural details if applicable, cultural importance, and any interesting legends or stories associated with it.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse the JSON response
    let historyData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        historyData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // Return a fallback response
      historyData = {
        title: `The History of ${placeName}`,
        timeline: "Historical landmark",
        description: content,
        keyFacts: [],
        images: [
          { url: `https://source.unsplash.com/featured/?${encodeURIComponent(placeName)},landmark`, caption: placeName }
        ],
        videos: [
          { url: `https://www.youtube.com/results?search_query=${encodeURIComponent(placeName)}+history`, title: `Watch videos about ${placeName}` }
        ]
      };
    }

    return new Response(JSON.stringify(historyData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in generate-place-history:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate history';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
