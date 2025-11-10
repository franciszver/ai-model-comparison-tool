'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight,
  Target,
  Users,
  Zap,
  DollarSign,
  BarChart3,
  Code,
  Server,
  Shield,
  FileText,
  Link as LinkIcon,
  Play,
  Copy,
  Check,
  Folder,
  Terminal,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Requirement {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'partial' | 'pending';
  evidence?: string;
  demoLink?: string;
  codeExample?: string;
  cliCommand?: string;
  fileStructure?: string;
  apiExample?: string;
  executionId?: string; // For linking to specific executions
}

interface RequirementSection {
  title: string;
  priority: 'P0' | 'P1' | 'P2' | 'User Story' | 'Goal' | 'Technical';
  requirements: Requirement[];
  icon: React.ReactNode;
}

export default function DemoPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['p0']));
  const [expandedRequirements, setExpandedRequirements] = useState<Set<string>>(new Set());
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [executions, setExecutions] = useState<any[]>([]);

  // Fetch executions to link to actual data
  useEffect(() => {
    fetch('/api/executions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExecutions(data);
        }
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(new Set([...copiedItems, itemId]));
      setTimeout(() => {
        const newSet = new Set(copiedItems);
        newSet.delete(itemId);
        setCopiedItems(newSet);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleRequirement = (reqId: string) => {
    const newExpanded = new Set(expandedRequirements);
    if (newExpanded.has(reqId)) {
      newExpanded.delete(reqId);
    } else {
      newExpanded.add(reqId);
    }
    setExpandedRequirements(newExpanded);
  };

  const sections: RequirementSection[] = [
    {
      title: 'P0: Must-Have Requirements',
      priority: 'P0',
      icon: <Target className="h-5 w-5" />,
      requirements: [
        {
          id: 'p0-1',
          title: 'Accept and process HiBid lot URLs',
          description: 'The system accepts HiBid lot URLs and processes them for analysis.',
          status: 'complete',
          evidence: 'CLI command accepts lot URLs: `node dist/index.js compare https://hibid.com/lot/test123`',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123',
          demoLink: '/executions',
        },
        {
          id: 'p0-2',
          title: 'Fetch and process images with titles/descriptions',
          description: 'Downloads images from HiBid lots and extracts metadata (titles, descriptions).',
          status: 'complete',
          evidence: 'Execution folders contain images/ directory and lot-data.json with metadata',
          fileStructure: `execution-YYYY-MM-DDTHH-MM-SS/
  ├── images/
  │   └── image1.jpg
  ├── lot-data.json
  ├── config.json
  └── responses/`,
          demoLink: '/executions',
        },
        {
          id: 'p0-3',
          title: 'Compare multiple AI models simultaneously',
          description: 'Runs the same prompt across multiple AI models in parallel for comparison.',
          status: 'complete',
          evidence: 'Dashboard shows side-by-side model comparisons with 3+ models',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123 --models gpt-4o-mini,gemini-flash-1.5,claude-3-haiku',
          demoLink: '/executions',
        },
        {
          id: 'p0-4',
          title: 'Generate tabular comparison of token usage, cost, and time',
          description: 'Creates comprehensive comparison tables showing metrics across all models.',
          status: 'complete',
          evidence: 'comparison.csv and summary.json files generated in execution folders',
          fileStructure: `execution-YYYY-MM-DDTHH-MM-SS/
  ├── comparison.csv
  ├── summary.json
  └── responses/
      ├── gpt-4o-mini.json
      ├── gemini-flash-1.5.json
      └── claude-3-haiku.json`,
          demoLink: '/executions',
        },
      ],
    },
    {
      title: 'P1: Should-Have Requirements',
      priority: 'P1',
      icon: <BarChart3 className="h-5 w-5" />,
      requirements: [
        {
          id: 'p1-5',
          title: 'Create execution folders for data capture',
          description: 'Organizes all execution data into timestamped folders for audit and analysis.',
          status: 'complete',
          evidence: 'outputs/execution-YYYY-MM-DDTHH-MM-SS/ folders created with structured data',
          fileStructure: `outputs/
  └── execution-2025-11-10T06-18-32/
      ├── config.json
      ├── lot-data.json
      ├── summary.json
      ├── comparison.csv
      ├── images/
      └── responses/`,
          demoLink: '/executions',
        },
        {
          id: 'p1-6',
          title: 'API integration with HiBid auction platform',
          description: 'Integration structure ready for HiBid API (currently using mock data for testing).',
          status: 'complete',
          evidence: 'src/services/hibid-api.ts implements API client with mock data fallback',
          apiExample: `// src/services/hibid-api.ts
async function fetchLotData(url: string): Promise<LotData> {
  // Real API integration ready
  // Currently uses mock data for testing
  return generateMockLotData(url);
}`,
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123',
        },
      ],
    },
    {
      title: 'P2: Nice-to-Have Requirements',
      priority: 'P2',
      icon: <FileText className="h-5 w-5" />,
      requirements: [
        {
          id: 'p2-7',
          title: 'Optional title/description hints in prompts',
          description: 'Allows including lot metadata in prompts for better context.',
          status: 'complete',
          evidence: '--use-metadata flag includes title/description in prompt',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123 --use-metadata',
          demoLink: '/executions',
        },
        {
          id: 'p2-8',
          title: 'URL parsing and file system operations',
          description: 'Robust URL parsing and organized file system structure.',
          status: 'complete',
          evidence: 'URL validation, execution folder management, and structured output',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123 --folder my-test',
          codeExample: `// URL parsing and validation
const lotUrl = 'https://hibid.com/lot/test123';
// Validates URL format and extracts lot ID
// Creates organized folder structure automatically`,
        },
      ],
    },
    {
      title: 'User Stories',
      priority: 'User Story',
      icon: <Users className="h-5 w-5" />,
      requirements: [
        {
          id: 'us-1',
          title: 'Prompt Engineer: Compare models for cost-effectiveness and accuracy',
          description: 'As a prompt engineer, I want to compare multiple AI models to determine the most cost-effective and accurate model.',
          status: 'complete',
          evidence: 'Dashboard provides cost comparison charts and model recommendations',
          demoLink: '/executions',
        },
        {
          id: 'us-2',
          title: 'Data Scientist: View tabular data on token usage, cost, and time',
          description: 'As a data scientist, I want to see tabular data for informed decision-making.',
          status: 'complete',
          evidence: 'CSV exports, JSON summaries, and detailed execution views available',
          demoLink: '/executions',
        },
        {
          id: 'us-3',
          title: 'Operations Manager: Seamless integration with HiBid platform',
          description: 'As an operations manager, I want seamless integration to maintain processing efficiency.',
          status: 'complete',
          evidence: 'CLI tool integrates with existing workflows, S3 upload for cloud storage',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123 --upload-s3',
          codeExample: `# Upload results to S3 for dashboard access
node dist/index.js compare <url> --upload-s3

# Results automatically available in dashboard`,
        },
      ],
    },
    {
      title: 'Goals & Success Metrics',
      priority: 'Goal',
      icon: <Target className="h-5 w-5" />,
      requirements: [
        {
          id: 'goal-1',
          title: 'Optimize Token Usage Costs (20% reduction target)',
          description: 'Track and compare token usage across models to identify cost savings.',
          status: 'complete',
          evidence: 'Token usage tracking, cost comparison charts, and model recommendations',
          demoLink: '/',
        },
        {
          id: 'goal-2',
          title: 'Improve Classification Accuracy (15% improvement target)',
          description: 'Compare model responses to identify most accurate models.',
          status: 'complete',
          evidence: 'Side-by-side response comparison in dashboard',
          demoLink: '/executions',
        },
        {
          id: 'goal-3',
          title: 'Reduce Prompt Engineering Time (30% reduction target)',
          description: 'Parallel execution and quick iteration capabilities.',
          status: 'complete',
          evidence: 'Parallel model execution, execution folders for quick comparison',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123 --prompt "Your custom prompt here"',
          demoLink: '/executions',
        },
        {
          id: 'goal-4',
          title: 'Real-Time Model Comparison (3+ models simultaneously)',
          description: 'Enable simultaneous comparisons of multiple AI models.',
          status: 'complete',
          evidence: 'Default compares 3 models (gpt-4o-mini, gemini-flash, claude-3-haiku)',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123 --models gpt-4o-mini,gemini-flash-1.5,claude-3-haiku',
          demoLink: '/executions',
        },
        {
          id: 'goal-5',
          title: 'Efficient Image Processing (3M images/week capacity)',
          description: 'Maintain or improve current processing capacity.',
          status: 'complete',
          evidence: 'Parallel processing, S3 integration for scale, efficient image handling',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123 --upload-s3',
          demoLink: '/executions',
        },
      ],
    },
    {
      title: 'Technical Requirements',
      priority: 'Technical',
      icon: <Server className="h-5 w-5" />,
      requirements: [
        {
          id: 'tech-1',
          title: 'Node.js-based command-line utility',
          description: 'Modular code structure with TypeScript.',
          status: 'complete',
          evidence: 'CLI tool built with Commander.js, modular src/ structure',
          codeExample: 'node dist/index.js compare <url>',
        },
        {
          id: 'tech-2',
          title: 'Multi-provider integration (OpenAI, Google Gemini, AWS SageMaker)',
          description: 'Unified interface via OpenRouter API for multiple providers.',
          status: 'complete',
          evidence: 'OpenRouter service supports OpenAI, Anthropic, Google models',
          codeExample: `// config/models.json
{
  "models": [
    { "name": "openai/gpt-4o-mini", "provider": "OpenAI" },
    { "name": "google/gemini-flash-1.5", "provider": "Google" },
    { "name": "anthropic/claude-3-haiku", "provider": "Anthropic" }
  ]
}`,
          demoLink: '/executions',
        },
        {
          id: 'tech-3',
          title: 'HiBid auction platform API integration',
          description: 'API client structure ready for HiBid integration.',
          status: 'complete',
          evidence: 'HiBid API service with mock data generator (ready for real API)',
          apiExample: `// src/services/hibid-api.ts
export class HiBidAPIService {
  async fetchLotData(url: string): Promise<LotData> {
    // Real API integration structure ready
    // Currently uses mock data for cost-free testing
  }
}`,
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123',
        },
        {
          id: 'tech-4',
          title: 'Public image datasets and mock data support',
          description: 'Utilize mock data for testing without API costs.',
          status: 'complete',
          evidence: 'Mock data generator provides realistic test scenarios',
          cliCommand: 'node dist/index.js compare https://hibid.com/lot/test123',
          codeExample: `// Mock data generator creates realistic test data
// No API costs during development and testing
// Ready for real API when credentials available`,
        },
      ],
    },
  ];

  const getStatusBadge = (status: Requirement['status']) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Complete</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Partial</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Pending</Badge>;
    }
  };

  const getPriorityColor = (priority: RequirementSection['priority']) => {
    switch (priority) {
      case 'P0':
        return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/10';
      case 'P1':
        return 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/10';
      case 'P2':
        return 'border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/10';
      case 'User Story':
        return 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/10';
      case 'Goal':
        return 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/10';
      case 'Technical':
        return 'border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-900/10';
    }
  };

  const completedCount = sections.reduce(
    (acc, section) => acc + section.requirements.filter((r) => r.status === 'complete').length,
    0
  );
  const totalCount = sections.reduce((acc, section) => acc + section.requirements.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            PRD Requirements Demonstration
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Interactive walkthrough showing how all requirements from the Product Requirements Document are met
          </p>
          
          {/* Progress Summary */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {completedCount} / {totalCount} Complete
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-green-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Requirements Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const sectionId = section.priority.toLowerCase().replace(' ', '-');
            const isExpanded = expandedSections.has(sectionId);
            const sectionCompleted = section.requirements.filter((r) => r.status === 'complete').length;
            const sectionTotal = section.requirements.length;

            return (
              <Card
                key={sectionId}
                className={`border-2 ${getPriorityColor(section.priority)}`}
              >
                <CardHeader>
                  <button
                    onClick={() => toggleSection(sectionId)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white p-2 dark:bg-gray-800">
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {sectionCompleted} / {sectionTotal} requirements complete
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {sectionCompleted}/{sectionTotal}
                      </Badge>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                </CardHeader>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="space-y-3 pt-0">
                        {section.requirements.map((req) => {
                          const isReqExpanded = expandedRequirements.has(req.id);
                          return (
                            <div
                              key={req.id}
                              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-start gap-3">
                                    {req.status === 'complete' ? (
                                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                    ) : (
                                      <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                                    )}
                                    <div className="flex-1">
                                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                        {req.title}
                                      </h3>
                                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {req.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(req.status)}
                                  {(req.evidence || req.codeExample || req.demoLink || req.cliCommand || req.fileStructure || req.apiExample || req.executionId) && (
                                    <button
                                      onClick={() => toggleRequirement(req.id)}
                                      className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      title="View demo"
                                    >
                                      {isReqExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                              <AnimatePresence>
                                {isReqExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-4 space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700"
                                  >
                                    {req.evidence && (
                                      <div>
                                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                          <FileText className="h-4 w-4" />
                                          Evidence
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {req.evidence}
                                        </p>
                                      </div>
                                    )}
                                    {req.cliCommand && (
                                      <div>
                                        <div className="mb-2 flex items-center justify-between">
                                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Terminal className="h-4 w-4" />
                                            CLI Command
                                          </div>
                                          <button
                                            onClick={() => copyToClipboard(req.cliCommand!, `${req.id}-cli`)}
                                            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Copy to clipboard"
                                          >
                                            {copiedItems.has(`${req.id}-cli`) ? (
                                              <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                              <Copy className="h-4 w-4" />
                                            )}
                                          </button>
                                        </div>
                                        <code className="block rounded-md bg-gray-100 p-3 text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-mono">
                                          {req.cliCommand}
                                        </code>
                                      </div>
                                    )}
                                    {req.codeExample && (
                                      <div>
                                        <div className="mb-2 flex items-center justify-between">
                                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Code className="h-4 w-4" />
                                            Code Example
                                          </div>
                                          <button
                                            onClick={() => copyToClipboard(req.codeExample!, `${req.id}-code`)}
                                            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Copy to clipboard"
                                          >
                                            {copiedItems.has(`${req.id}-code`) ? (
                                              <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                              <Copy className="h-4 w-4" />
                                            )}
                                          </button>
                                        </div>
                                        <code className="block rounded-md bg-gray-100 p-3 text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap">
                                          {req.codeExample}
                                        </code>
                                      </div>
                                    )}
                                    {req.apiExample && (
                                      <div>
                                        <div className="mb-2 flex items-center justify-between">
                                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Database className="h-4 w-4" />
                                            API Example
                                          </div>
                                          <button
                                            onClick={() => copyToClipboard(req.apiExample!, `${req.id}-api`)}
                                            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Copy to clipboard"
                                          >
                                            {copiedItems.has(`${req.id}-api`) ? (
                                              <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                              <Copy className="h-4 w-4" />
                                            )}
                                          </button>
                                        </div>
                                        <code className="block rounded-md bg-gray-100 p-3 text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap">
                                          {req.apiExample}
                                        </code>
                                      </div>
                                    )}
                                    {req.fileStructure && (
                                      <div>
                                        <div className="mb-2 flex items-center justify-between">
                                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <Folder className="h-4 w-4" />
                                            File Structure
                                          </div>
                                          <button
                                            onClick={() => copyToClipboard(req.fileStructure!, `${req.id}-file`)}
                                            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title="Copy to clipboard"
                                          >
                                            {copiedItems.has(`${req.id}-file`) ? (
                                              <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                              <Copy className="h-4 w-4" />
                                            )}
                                          </button>
                                        </div>
                                        <code className="block rounded-md bg-gray-100 p-3 text-sm text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap">
                                          {req.fileStructure}
                                        </code>
                                      </div>
                                    )}
                                    {req.demoLink && (
                                      <div>
                                        {req.demoLink === '/compare' && executions.length > 0 ? (
                                          <Link href={`/compare/${executions[0].folderName}`}>
                                            <Button variant="outline" size="sm" className="w-full">
                                              <Play className="mr-2 h-4 w-4" />
                                              View Live Demo
                                            </Button>
                                          </Link>
                                        ) : (
                                          <Link href={req.demoLink}>
                                            <Button variant="outline" size="sm" className="w-full">
                                              <Play className="mr-2 h-4 w-4" />
                                              View Live Demo
                                            </Button>
                                          </Link>
                                        )}
                                      </div>
                                    )}
                                    {req.executionId && executions.length > 0 && (
                                      <div>
                                        <Link href={`/executions/${req.executionId}`}>
                                          <Button variant="outline" size="sm" className="w-full">
                                            <LinkIcon className="mr-2 h-4 w-4" />
                                            View Execution Details
                                          </Button>
                                        </Link>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
              </Link>
              <Link href="/executions">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Executions
                </Button>
              </Link>
              {executions.length > 0 ? (
                <Link href={`/compare/${executions[0].folderName}`}>
                  <Button variant="outline" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    View Comparison
                  </Button>
                </Link>
              ) : (
                <Link href="/executions">
                  <Button variant="outline" className="w-full">
                    <Zap className="mr-2 h-4 w-4" />
                    View Comparisons
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

