import OpenAI from "openai";
import { BaseAd } from "types/ad";

class GPTClient {
    private gptClient: OpenAI;
    private static systemRole = "You are a categorization assistant to normalize text.";
    private static userPrompt = `
        Define the title, price, location and description of the following ad.\n
        Return the result as a JSON object with the following keys: title, price(as a number type), currency(as a unicode point in string), location, description.\n
        Return "description" value should be normalized and original text shoundn't be translated.\n
        Return null value for the key that isn't available\n
        If you can't generate ad from the text, return a null. :\n
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
        const res = parseResponse.choices[0].message.content;
        if (res) {
            const ads = JSON.parse(res) as BaseAd;
            return ads;
        }
        return null;
    }
}

export default GPTClient;
