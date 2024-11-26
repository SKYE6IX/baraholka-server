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
        const res = parseResponse.choices[0].message.content;
        if (res) {
            const ads = JSON.parse(res);
            return ads;
        }
        return null;
    }
}
GPTClient.systemRole = "You are a categorization assistant to normalize text.";
GPTClient.userPrompt = `
        Define the title, price, location and description of the following ad.\n
        Return the result as a JSON object with the following keys: title, price(as a number type), currency(as a unicode point in string), location, description.\n
        Return "description" value should be normalized and original text shoundn't be translated.\n
        Return null value for the key that isn't available\n
        If you can't generate ad from the text, return a null. :\n
        `;
export default GPTClient;
