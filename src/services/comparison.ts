import { OpenRouterService, ModelResponse } from './openrouter';
import { ImageData } from '../utils/image-handler';
import modelsConfig from '../../config/models.json';

export interface ComparisonResult {
  model: string;
  response: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  cost?: number;
  latency?: number;
  error?: string;
}

export interface ComparisonConfig {
  models: string[];
  prompt: string;
  images: ImageData[];
  useMetadata: boolean;
  title?: string;
  description?: string;
}

export class ComparisonService {
  private openRouter: OpenRouterService;

  constructor(openRouter: OpenRouterService) {
    this.openRouter = openRouter;
  }

  /**
   * Get model pricing from config
   */
  private getModelPricing(model: string): { input: number; output: number } | null {
    const models = (modelsConfig as any).models;
    const modelConfig = models?.[model];
    if (!modelConfig || !modelConfig.pricing) {
      return null;
    }
    return modelConfig.pricing;
  }

  /**
   * Build prompt with optional metadata
   */
  private buildPrompt(basePrompt: string, useMetadata: boolean, title?: string, description?: string): string {
    if (!useMetadata || (!title && !description)) {
      return basePrompt;
    }

    let prompt = basePrompt;
    if (title) {
      prompt += `\n\nTitle: ${title}`;
    }
    if (description) {
      prompt += `\n\nDescription: ${description}`;
    }

    return prompt;
  }

  /**
   * Compare models with images (vision mode)
   */
  async compareWithImages(config: ComparisonConfig): Promise<ComparisonResult[]> {
    const results: ComparisonResult[] = [];
    const prompt = this.buildPrompt(config.prompt, config.useMetadata, config.title, config.description);

    // Process models in parallel
    const promises = config.models.map(async (model) => {
      try {
        // Use first image for now (can be extended to handle multiple images)
        const image = config.images[0];
        if (!image || !image.base64) {
          throw new Error('No image data available');
        }

        const message = this.openRouter.createVisionMessage(image.base64, prompt);
        const response = await this.openRouter.callModel(model, [message]);

        // Calculate cost
        const pricing = this.getModelPricing(model);
        const cost = pricing
          ? this.openRouter.calculateCost(response.inputTokens, response.outputTokens, pricing)
          : undefined;

        return {
          model,
          response: response.response,
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens,
          totalTokens: response.totalTokens,
          cost,
          latency: response.latency,
        } as ComparisonResult;
      } catch (error) {
        return {
          model,
          response: '',
          error: error instanceof Error ? error.message : String(error),
        } as ComparisonResult;
      }
    });

    const modelResults = await Promise.all(promises);
    results.push(...modelResults);

    return results;
  }

  /**
   * Compare models with text only (no images)
   */
  async compareTextOnly(config: ComparisonConfig): Promise<ComparisonResult[]> {
    const results: ComparisonResult[] = [];
    const prompt = this.buildPrompt(config.prompt, config.useMetadata, config.title, config.description);

    // Process models in parallel
    const promises = config.models.map(async (model) => {
      try {
        const message = this.openRouter.createTextMessage(prompt);
        const response = await this.openRouter.callModel(model, [message]);

        // Calculate cost
        const pricing = this.getModelPricing(model);
        const cost = pricing
          ? this.openRouter.calculateCost(response.inputTokens, response.outputTokens, pricing)
          : undefined;

        return {
          model,
          response: response.response,
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens,
          totalTokens: response.totalTokens,
          cost,
          latency: response.latency,
        } as ComparisonResult;
      } catch (error) {
        return {
          model,
          response: '',
          error: error instanceof Error ? error.message : String(error),
        } as ComparisonResult;
      }
    });

    const modelResults = await Promise.all(promises);
    results.push(...modelResults);

    return results;
  }

  /**
   * Compare models (automatically chooses vision or text mode)
   */
  async compare(config: ComparisonConfig): Promise<ComparisonResult[]> {
    if (config.images && config.images.length > 0 && config.images[0].base64) {
      return this.compareWithImages(config);
    } else {
      return this.compareTextOnly(config);
    }
  }
}

