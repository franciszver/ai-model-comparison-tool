// TypeScript types for the dashboard

export interface ExecutionConfig {
  timestamp: string;
  lotUrl: string;
  models: string[];
  prompt: string;
  useMetadata: boolean;
  outputFormat: string;
}

export interface LotData {
  lotId: string;
  title: string;
  description: string;
  images: string[];
  url: string;
}

export interface ModelResponse {
  model: string;
  response: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  cost?: number;
  latency?: number;
  error?: string;
}

export interface ExecutionSummary {
  timestamp: string;
  lotUrl: string;
  models: number;
  successful: number;
  failed: number;
  totalCost: number;
  totalTokens: number;
  avgLatency: number;
}

export interface ExecutionData {
  config: ExecutionConfig;
  lotData: LotData;
  responses: Record<string, ModelResponse>;
  summary: ExecutionSummary;
}

export interface ExecutionListItem {
  folderName: string;
  timestamp: string;
  lotUrl: string;
  models: number;
  totalCost: number;
  avgLatency: number;
  successful: number;
}


