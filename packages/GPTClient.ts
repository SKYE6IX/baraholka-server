import OpenAI from "openai";

class GPTClient {
    private gptClient: OpenAI;

    constructor(apiKey: string, organizationId: string, projectId: string) {
        this.gptClient = new OpenAI({
            apiKey: apiKey,
            organization: organizationId,
            project: projectId,
        });
    }
}

export default GPTClient;
