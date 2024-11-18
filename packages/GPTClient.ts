import OpenAI from "openai";

class GPTClient {
    private gptClient: OpenAI;
    private static systemRole =
        "You are a categorization assistant to normalize messages.";
    private static userPrompt = `
        Define the price, location and description of the following ad.\n
        Return the result as a list of JSON objects with the following keys: price, currency, location, description.\n
        Return only JSON without formatting, description should be normalized.\n
        If the ad is not available, return an empty list. :\n
        `;

    constructor(apiKey: string, organizationId: string, projectId: string) {
        this.gptClient = new OpenAI({
            apiKey: apiKey,
            organization: organizationId,
            project: projectId,
        });
    }

    public async parseMessage(tgMessage: string) {
        const parseResponse = await this.gptClient.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: GPTClient.systemRole,
                },
                { role: "user", content: GPTClient.userPrompt + tgMessage },
            ],
            temperature: 0.8,
        });

        console.log(parseResponse);

        return parseResponse;
    }
}

export default GPTClient;
