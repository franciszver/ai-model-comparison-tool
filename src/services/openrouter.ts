import axios, { AxiosInstance } from 'axios';

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelResponse {
  model: string;
  response: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latency: number;
  error?: string;
}

export class OpenRouterService {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/ai-model-comparison-tool',
        'X-Title': 'AI Model Comparison Tool',
      },
      timeout: 120000, // 2 minutes timeout
    });
  }

  /**
   * Call OpenRouter API with retry logic
   */
  async callModel(
    model: string,
    messages: OpenRouterMessage[],
    maxRetries = 3
  ): Promise<ModelResponse> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.post<OpenRouterResponse>('/chat/completions', {
          model,
          messages,
        });

        const latency = Date.now() - startTime;
        const usage = response.data.usage;

        return {
          model,
          response: response.data.choices[0]?.message?.content || '',
          inputTokens: usage.prompt_tokens,
          outputTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
          latency,
        };
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on 4xx errors (client errors)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw new Error(
            `API Error (${error.response?.status}): ${error.response?.data?.error?.message || error.message}`
          );
        }

        // Retry on 5xx errors or network errors
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    throw new Error(
      `Failed after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
    );
  }

  /**
   * Create vision message with image and text
   */
  createVisionMessage(imageBase64: string, text: string): OpenRouterMessage {
    return {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: imageBase64,
          },
        },
        {
          type: 'text',
          text,
        },
      ],
    };
  }

  /**
   * Create text-only message
   */
  createTextMessage(text: string): OpenRouterMessage {
    return {
      role: 'user',
      content: text,
    };
  }

  /**
   * Calculate cost based on model pricing
   */
  calculateCost(
    inputTokens: number,
    outputTokens: number,
    pricing: { input: number; output: number }
  ): number {
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    return inputCost + outputCost;
  }
}


