import OpenAI from "openai";
class GPTClient {
    constructor(apiKey, organizationId, projectId) {
        this.gptClient = new OpenAI({
            apiKey: apiKey,
            organization: organizationId,
            project: projectId,
        });
    }
}
export default GPTClient;
