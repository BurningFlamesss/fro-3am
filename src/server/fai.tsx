import { createServerFn } from "@tanstack/react-start";

export const getAIResponse = createServerFn()
	.validator(
		(data: { key: string; prompt: string; scopes: Array<string> }) => data,
	)
	.handler(async ({ data }) => {
		try {
			const apiKey = data.key ?? process.env.FAI_API_KEY;

			if (!apiKey) {
				throw new Error("Fai API key missing");
			}

            
		} catch (error) {}
	});
