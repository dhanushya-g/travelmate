import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, fromAddress, startDate, endDate, travelers, styles, budget } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const tripDays = startDate && endDate 
      ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 3;

    const systemPrompt = `You are an expert travel planner. Generate a detailed day-by-day travel itinerary in JSON format.
Return ONLY valid JSON with this exact structure:
{
  "destination": "destination name",
  "summary": "brief trip summary",
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "description": "Brief description",
          "duration": "2 hours",
          "cost": "$20",
          "tips": "Helpful tip"
        }
      ],
      "meals": {
        "breakfast": "Restaurant name - cuisine type",
        "lunch": "Restaurant name - cuisine type", 
        "dinner": "Restaurant name - cuisine type"
      },
      "hotel": "Hotel recommendation for this area"
    }
  ],
  "totalEstimatedCost": "$XXX",
  "packingTips": ["tip1", "tip2"],
  "localTips": ["tip1", "tip2"]
}`;

    const userPrompt = `Create a ${tripDays}-day itinerary for ${destination}.
${fromAddress ? `Starting from: ${fromAddress}` : ""}
Travelers: ${travelers}
Travel styles: ${styles?.join(", ") || "General"}
Budget: ${budget || "moderate"}
${startDate ? `Start date: ${startDate}` : ""}

Include specific attractions, restaurants, timing, costs, and local tips. Consider rush hours and optimal visit times. Make it realistic and actionable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate itinerary");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Extract JSON from the response
    let itinerary;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse itinerary:", parseError, content);
      throw new Error("Failed to parse itinerary response");
    }

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
