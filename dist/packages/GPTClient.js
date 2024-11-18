import OpenAI from "openai";
class GPTClient {
    constructor(apiKey, organizationId, projectId) {
        this.gptClient = new OpenAI({
            apiKey: apiKey,
            organization: organizationId,
            project: projectId,
        });
    }
    async parseMessage(tgMessage) {
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
GPTClient.systemRole = "You are a categorization assistant to normalize messages.";
GPTClient.userPrompt = `
        Define the price, location and description of the following ad.\n
        Return the result as a list of JSON objects with the following keys: price, currency, location, description.\n
        Return only JSON without formatting, description should be normalized.\n
        If the ad is not available, return an empty list. :\n
        `;
export default GPTClient;
