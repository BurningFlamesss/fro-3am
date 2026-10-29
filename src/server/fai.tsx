import { terminalExecutions } from "#/constants/fai-tools.tsx";
import { chat, toServerSentEventsResponse, type UIMessage } from "@tanstack/ai";
import { openRouterText } from "@tanstack/ai-openrouter";
import { createServerFn } from "@tanstack/react-start";

export const getAIResponse = createServerFn({ method: "POST" })
	.validator(
		(data: {
			messages: Array<UIMessage>;
			threadId: string;
			key: string;
			prompt: string;
			scopes: Array<string>
		}) => data,
	)
	.handler(async ({ data }) => {
		try {
			console.log("getAIResponse called!!")
			const apiKey = data.key || process.env.FAI_API_KEY;

			if (!apiKey) {
				throw new Error("Fai API key missing");
			}

			console.log("Inner getAIResponse called!!")

			const stream = chat({
				adapter: openRouterText("cohere/north-mini-code:free", {
					serverURL: "https://openrouter.ai/api/v1"
				}),
				threadId: data.threadId,
				messages: data.messages,
				tools: [terminalExecutions],
				systemPrompts: data.prompt ? [data.prompt] : undefined,
			})

			console.log("Stream received:", stream)

			return toServerSentEventsResponse(stream)
		} catch (error) {
			throw new Error(error instanceof Error ? error.message : String(error))
		}
	});
