import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// Create OpenRouter instance with app attribution headers
export const openrouter = createOpenRouter({
  headers: {
    "HTTP-Referer": process.env.VITE_APP_URL ?? "https://oschat.ai",
    "X-Title": process.env.VITE_APP_TITLE ?? "oschat.ai",
  },
});
