const GOOGLE_INPUT_TOOLS_API = "https://inputtools.google.com/request?text=TEXT&itc=bn-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage";

export const AvroPhonetic = {
    // We will now return the FIRST suggestion from Google API, or stub if offline
    // This function will need to be async now, but since the editor expects sync, we might need a cache or async handler.
    // However, for the purpose of "pressing space -> convert", async is tricky in simple textareas/contenteditable without complex handling.
    //
    // BUT! The user complained about "no text suggestion".
    // "Pressing space" is the conversion trigger.
    //
    // Strategy:
    // 1. fetchSuggestions(word) -> returns string[]
    // 2. parse(word) -> returns string (top suggestion) BUT this needs to be async or blocking?
    //    It *cannot* be blocking in JS.
    //
    // So we must change the architecture in PlaygroundEditor.tsx to handle async conversion.

    fetchSuggestions: async (word: string): Promise<string[]> => {
        if (!word) return [];
        try {
            const url = GOOGLE_INPUT_TOOLS_API.replace('TEXT', encodeURIComponent(word));
            const response = await fetch(url);
            const data = await response.json();

            // Response format: ["SUCCESS", [["TEXT", ["SUGGESTION1", "SUGGESTION2", ...], ...]]]
            // e.g. ["SUCCESS",[["ami",["আমি","অমি","আমী","আমিই","আমই"],[],{"candidate_type":[0,0,0,0,0]}]]]

            if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]) {
                return data[1][0][1];
            }
        } catch (e) {
            console.error("Avro Suggestion Error", e);
        }
        return [word]; // Fallback to original
    },

    // Keep a synchronous stub if needed, but the main logic should move to async
    parse: (text: string): string => {
        // Fallback for sync usage, basically useless now if we want real suggestions
        return text;
    }
};
