import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export interface LotData {
  lotId: string;
  title: string;
  description: string;
  images: string[];
  url: string;
}

export class HiBidAPIService {
  private apiKey?: string;
  private apiEndpoint?: string;
  private cacheDir: string;

  constructor(apiKey?: string, apiEndpoint?: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = apiEndpoint;
    this.cacheDir = path.join(process.cwd(), '.cache', 'hibid');
    
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Parse lot ID from HiBid URL
   */
  parseLotId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // Common HiBid URL patterns:
      // https://hibid.com/lot/{lotId}
      // https://www.hibid.com/lot/{lotId}
      // https://hibid.com/auctions/{auctionId}/lot/{lotId}
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      
      // Look for 'lot' in path and get the next segment
      const lotIndex = pathParts.indexOf('lot');
      if (lotIndex !== -1 && lotIndex < pathParts.length - 1) {
        return pathParts[lotIndex + 1];
      }
      
      // Fallback: try to extract from hash or query params
      const hashMatch = urlObj.hash.match(/lot[\/=](\w+)/i);
      if (hashMatch) {
        return hashMatch[1];
      }
      
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Generate mock lot data for testing
   */
  generateMockLotData(url: string): LotData {
    const lotId = this.parseLotId(url) || 'mock-lot-12345';
    
    // Use placeholder images from a free service (using seed for consistency)
    const seed = lotId.charCodeAt(0) + (lotId.length || 0);
    const mockImages = [
      `https://picsum.photos/800/600?random=${seed}`,
      `https://picsum.photos/800/600?random=${seed + 1}`,
    ];

    const mockTitles = [
      'Vintage Antique Furniture Collection',
      'Rare Collectible Artwork',
      'Fine Jewelry Set',
      'Classic Timepiece',
      'Decorative Ceramic Vase',
    ];

    const mockDescriptions = [
      'Beautiful vintage furniture piece in excellent condition. Perfect for collectors.',
      'Rare artwork from a renowned artist. Includes certificate of authenticity.',
      'Elegant jewelry set featuring precious stones and metals.',
      'Classic timepiece in working condition. A timeless addition to any collection.',
      'Decorative ceramic vase with intricate patterns. Handcrafted and unique.',
    ];

    const randomIndex = Math.floor(Math.random() * mockTitles.length);

    return {
      lotId,
      title: mockTitles[randomIndex],
      description: mockDescriptions[randomIndex],
      images: mockImages,
      url,
    };
  }

  /**
   * Fetch lot data from HiBid API (when available)
   */
  async fetchLotData(url: string, useCache: boolean = true): Promise<LotData> {
    const lotId = this.parseLotId(url);
    
    // Check cache first (if enabled)
    if (useCache && lotId) {
      const cachePath = path.join(this.cacheDir, `${lotId}.json`);
      if (fs.existsSync(cachePath)) {
        const cached = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
        // Verify cached data has images, if not, regenerate
        if (cached.images && cached.images.length > 0) {
          return cached;
        }
        // If cached data has no images, fall through to regenerate
      }
    }

    // If API key is not provided, use mock data
    if (!this.apiKey || !this.apiEndpoint) {
      const mockData = this.generateMockLotData(url);
      // Ensure mock data always has images (double-check)
      if (!mockData.images || !Array.isArray(mockData.images) || mockData.images.length === 0) {
        const seed = (lotId || 'default').charCodeAt(0) + ((lotId || 'default').length || 0);
        mockData.images = [
          `https://picsum.photos/800/600?random=${seed}`,
          `https://picsum.photos/800/600?random=${seed + 1}`,
        ];
      }
      // Cache mock data (only if it has images)
      if (lotId && mockData.images && mockData.images.length > 0) {
        const cachePath = path.join(this.cacheDir, `${lotId}.json`);
        fs.writeFileSync(cachePath, JSON.stringify(mockData, null, 2));
      }
      return mockData;
    }

    // Real API call (to be implemented when API is available)
    try {
      const response = await axios.get(`${this.apiEndpoint}/lots/${lotId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 10000,
      });

      const lotData: LotData = {
        lotId: response.data.id || lotId,
        title: response.data.title || '',
        description: response.data.description || '',
        images: response.data.images || [],
        url,
      };

      // Cache the response
      if (lotId) {
        const cachePath = path.join(this.cacheDir, `${lotId}.json`);
        fs.writeFileSync(cachePath, JSON.stringify(lotData, null, 2));
      }

      return lotData;
    } catch (error) {
      console.warn('HiBid API call failed, using mock data:', error instanceof Error ? error.message : error);
      return this.generateMockLotData(url);
    }
  }
}

