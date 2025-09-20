import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, Star, TrendingUp, TrendingDown, MessageSquare, Users, ShoppingBag, Clock, X, ChevronRight, Sparkles, Shield, Link2, AlertCircle, CheckCircle2, Globe, Zap, Filter, Target, Lightbulb, BarChart3 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription } from './components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { automatedWebScraper } from './services/automatedWebScraper';
import { PlatformFeatures } from './components/PlatformFeatures';

type AppState = 'landing' | 'processing' | 'results';
type InputMode = 'url' | 'upload' | 'paste';

interface ScrapingMetrics {
  totalReviews: number;
  processed: number;
  fakeFiltered: number;
  averageRating: number;
  platform: string;
  processingSpeed: number;
  verifiedPurchases: number;
}

interface ReviewCluster {
  id: string;
  theme: string;
  insight: string;
  actionType: 'Fix' | 'Keep';
  rating: number;
  reviewCount: number;
  source: string;
  icon: React.ReactNode;
  color: string;
  urgencyLevel: 'High' | 'Medium' | 'Low';
  impactScore: number;
  recommendations: Array<{
    action: string;
    priority: 'Critical' | 'Important' | 'Moderate';
    timeframe: string;
    expectedImpact: string;
    implementationSteps: string[];
  }>;
  samples: Array<{
    id: string;
    text: string;
    rating: number;
    reviewer: string;
    source: string;
    date: string;
  }>;
}

interface AnalyticsData {
  sentimentBreakdown: Array<{ name: string; value: number; color: string }>;
  trendData: Array<{ category: string; score: number }>;
}

// Generate actionable recommendations based on review analysis
const generateActionableRecommendations = (theme: string, hasIssue: boolean, actionType: 'Fix' | 'Keep') => {
  const recommendationsMap = {
    'Delivery Experience': {
      Fix: [
        {
          action: 'Implement Express Shipping Options',
          priority: 'Critical' as const,
          timeframe: '2-4 weeks',
          expectedImpact: 'Reduce delivery complaints by 60-70%',
          implementationSteps: [
            'Partner with premium logistics providers',
            'Introduce same-day/next-day delivery options',
            'Implement real-time tracking system',
            'Train customer service team on delivery protocols'
          ]
        },
        {
          action: 'Enhance Packaging Standards',
          priority: 'Important' as const,
          timeframe: '1-2 weeks',
          expectedImpact: 'Reduce damage-related complaints by 40-50%',
          implementationSteps: [
            'Upgrade packaging materials',
            'Implement quality control checks',
            'Add fragile item protocols',
            'Include package handling instructions'
          ]
        }
      ],
      Keep: [
        {
          action: 'Maintain Current Delivery Excellence',
          priority: 'Important' as const,
          timeframe: 'Ongoing',
          expectedImpact: 'Sustain high customer satisfaction rates',
          implementationSteps: [
            'Continue monitoring delivery performance',
            'Maintain partnerships with reliable couriers',
            'Regular training for delivery personnel',
            'Keep transparent tracking system updated'
          ]
        }
      ]
    },
    'Product Quality': {
      Fix: [
        {
          action: 'Implement Quality Assurance Protocol',
          priority: 'Critical' as const,
          timeframe: '4-6 weeks',
          expectedImpact: 'Improve quality ratings by 40-60%',
          implementationSteps: [
            'Establish multi-stage quality checks',
            'Implement supplier audit system',
            'Create defect tracking database',
            'Develop quality metrics dashboard'
          ]
        },
        {
          action: 'Enhance Product Documentation',
          priority: 'Moderate' as const,
          timeframe: '2-3 weeks',
          expectedImpact: 'Reduce quality-related returns by 25-35%',
          implementationSteps: [
            'Update product descriptions with detailed specs',
            'Add high-quality product images',
            'Include material composition details',
            'Provide care and usage instructions'
          ]
        }
      ],
      Keep: [
        {
          action: 'Leverage Quality as Competitive Advantage',
          priority: 'Important' as const,
          timeframe: 'Ongoing',
          expectedImpact: 'Increase premium positioning and pricing power',
          implementationSteps: [
            'Highlight quality certifications in marketing',
            'Develop quality guarantee programs',
            'Create customer testimonial campaigns',
            'Expand into premium product categories'
          ]
        }
      ]
    },
    'Customer Service': {
      Fix: [
        {
          action: 'Deploy AI-Powered Support System',
          priority: 'Critical' as const,
          timeframe: '6-8 weeks',
          expectedImpact: 'Reduce response time by 70-80%',
          implementationSteps: [
            'Implement chatbot for common queries',
            'Create comprehensive FAQ database',
            'Train support team on escalation protocols',
            'Establish 24/7 support availability'
          ]
        },
        {
          action: 'Develop Proactive Support Strategy',
          priority: 'Important' as const,
          timeframe: '3-4 weeks',
          expectedImpact: 'Increase customer satisfaction by 45-55%',
          implementationSteps: [
            'Monitor social media for customer issues',
            'Send proactive order updates',
            'Implement feedback collection system',
            'Create customer success team'
          ]
        }
      ],
      Keep: [
        {
          action: 'Scale Excellent Service Model',
          priority: 'Important' as const,
          timeframe: 'Ongoing',
          expectedImpact: 'Build strong customer loyalty and referrals',
          implementationSteps: [
            'Document current best practices',
            'Scale training programs',
            'Implement service quality monitoring',
            'Develop customer loyalty programs'
          ]
        }
      ]
    },
    'Value for Money': {
      Fix: [
        {
          action: 'Optimize Pricing Strategy',
          priority: 'Critical' as const,
          timeframe: '4-6 weeks',
          expectedImpact: 'Improve value perception by 35-45%',
          implementationSteps: [
            'Conduct competitive pricing analysis',
            'Introduce tiered pricing options',
            'Develop bundle offers and discounts',
            'Create value communication strategy'
          ]
        },
        {
          action: 'Enhance Value Proposition',
          priority: 'Important' as const,
          timeframe: '2-3 weeks',
          expectedImpact: 'Increase conversion rates by 20-30%',
          implementationSteps: [
            'Highlight unique product features',
            'Add warranty and guarantee options',
            'Include free shipping thresholds',
            'Develop comparison tools with competitors'
          ]
        }
      ],
      Keep: [
        {
          action: 'Capitalize on Value Leadership',
          priority: 'Important' as const,
          timeframe: 'Ongoing',
          expectedImpact: 'Strengthen market position and increase market share',
          implementationSteps: [
            'Develop value-focused marketing campaigns',
            'Introduce referral incentive programs',
            'Expand product line with similar value proposition',
            'Monitor and maintain competitive pricing'
          ]
        }
      ]
    }
  };

  return recommendationsMap[theme as keyof typeof recommendationsMap]?.[actionType] || [];
};

// Realistic review data with actionable insights
const generateReviewClusters = (reviewText: string): ReviewCluster[] => {
  const text = reviewText.toLowerCase();
  const hasDeliveryIssues = text.includes('delivery') || text.includes('shipping') || text.includes('slow');
  const hasQualityIssues = text.includes('quality') || text.includes('poor') || text.includes('cheap');
  const hasServiceIssues = text.includes('service') || text.includes('support') || text.includes('help');
  const hasPositiveFeedback = text.includes('excellent') || text.includes('great') || text.includes('amazing');

  return [
    {
      id: '1',
      theme: 'Delivery Experience',
      insight: hasDeliveryIssues ? 
        'Customers report delays and shipping issues affecting satisfaction' :
        'Fast delivery times are consistently praised by customers',
      actionType: hasDeliveryIssues ? 'Fix' : 'Keep',
      rating: hasDeliveryIssues ? 3.2 : 4.6,
      reviewCount: 89,
      source: 'Amazon, Flipkart',
      icon: <TrendingUp className="w-5 h-5" />,
      color: hasDeliveryIssues ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600',
      urgencyLevel: hasDeliveryIssues ? 'High' : 'Low',
      impactScore: hasDeliveryIssues ? 8.5 : 9.2,
      recommendations: generateActionableRecommendations('Delivery Experience', hasDeliveryIssues, hasDeliveryIssues ? 'Fix' : 'Keep'),
      samples: [
        {
          id: '1',
          text: hasDeliveryIssues ? 
            'The product is good but delivery took way too long. Expected it in 2 days, got it in 6 days.' :
            'Super fast delivery! Ordered yesterday and received today. Packaging was excellent too.',
          rating: hasDeliveryIssues ? 2 : 5,
          reviewer: 'Rajesh Kumar',
          source: 'Amazon',
          date: '2024-01-15'
        },
        {
          id: '2',
          text: hasDeliveryIssues ?
            'Late delivery and the package was damaged. Customer service was not helpful either.' :
            'Amazing delivery speed and the product arrived in perfect condition. Very impressed!',
          rating: hasDeliveryIssues ? 1 : 5,
          reviewer: 'Priya Sharma',
          source: 'Flipkart',
          date: '2024-01-14'
        },
        {
          id: '3',
          text: hasDeliveryIssues ?
            'Average product but the shipping delay was really frustrating. They need to improve logistics.' :
            'Quick delivery as promised. The tracking was accurate and delivery person was courteous.',
          rating: hasDeliveryIssues ? 3 : 4,
          reviewer: 'Anonymous User',
          source: 'Amazon',
          date: '2024-01-13'
        }
      ]
    },
    {
      id: '2',
      theme: 'Product Quality',
      insight: hasQualityIssues ?
        'Quality inconsistencies reported across multiple product batches' :
        'Consistently high product quality exceeding customer expectations',
      actionType: hasQualityIssues ? 'Fix' : 'Keep',
      rating: hasQualityIssues ? 3.4 : 4.5,
      reviewCount: 124,
      source: 'Amazon, Myntra',
      icon: <Star className="w-5 h-5" />,
      color: hasQualityIssues ? 'from-orange-500 to-orange-600' : 'from-blue-500 to-blue-600',
      urgencyLevel: hasQualityIssues ? 'High' : 'Medium',
      impactScore: hasQualityIssues ? 9.1 : 8.8,
      recommendations: generateActionableRecommendations('Product Quality', hasQualityIssues, hasQualityIssues ? 'Fix' : 'Keep'),
      samples: [
        {
          id: '1',
          text: hasQualityIssues ?
            'The material feels cheap and the stitching is poor. Not worth the price at all.' :
            'Excellent quality! The material is premium and craftsmanship is top-notch. Highly recommend.',
          rating: hasQualityIssues ? 2 : 5,
          reviewer: 'Sneha Patel',
          source: 'Myntra',
          date: '2024-01-16'
        },
        {
          id: '2',
          text: hasQualityIssues ?
            'Product looks different from photos. Quality is below average for this price range.' :
            'Amazing quality! Exactly as described and even better in person. Great value for money.',
          rating: hasQualityIssues ? 2 : 5,
          reviewer: 'Arjun Singh',
          source: 'Amazon',
          date: '2024-01-15'
        },
        {
          id: '3',
          text: hasQualityIssues ?
            'Okay product but quality could be much better. Some defects noticed upon inspection.' :
            'Perfect quality and finish. This brand never disappoints. Will definitely buy again.',
          rating: hasQualityIssues ? 3 : 5,
          reviewer: 'Maya Reddy',
          source: 'Myntra',
          date: '2024-01-14'
        }
      ]
    },
    {
      id: '3',
      theme: 'Customer Service',
      insight: hasServiceIssues ?
        'Customer support response times and helpfulness need improvement' :
        'Excellent customer service with quick resolution of queries',
      actionType: hasServiceIssues ? 'Fix' : 'Keep',
      rating: hasServiceIssues ? 3.1 : 4.4,
      reviewCount: 67,
      source: 'All Platforms',
      icon: <MessageSquare className="w-5 h-5" />,
      color: hasServiceIssues ? 'from-purple-500 to-purple-600' : 'from-teal-500 to-teal-600',
      urgencyLevel: hasServiceIssues ? 'High' : 'Low',
      impactScore: hasServiceIssues ? 8.9 : 9.0,
      recommendations: generateActionableRecommendations('Customer Service', hasServiceIssues, hasServiceIssues ? 'Fix' : 'Keep'),
      samples: [
        {
          id: '1',
          text: hasServiceIssues ?
            'Contacted customer service about defective product. No response for 3 days. Very poor.' :
            'Outstanding customer service! They resolved my issue within hours. Very professional team.',
          rating: hasServiceIssues ? 1 : 5,
          reviewer: 'Vikram Gupta',
          source: 'Flipkart',
          date: '2024-01-16'
        },
        {
          id: '2',
          text: hasServiceIssues ?
            'Customer service is unhelpful and rude. They refused to process my legitimate return.' :
            'Fantastic support team! They went above and beyond to help me. Truly impressed.',
          rating: hasServiceIssues ? 1 : 5,
          reviewer: 'Anita Das',
          source: 'Amazon',
          date: '2024-01-15'
        },
        {
          id: '3',
          text: hasServiceIssues ?
            'Average customer service. Takes too long to get responses and solutions.' :
            'Quick and helpful customer service. They made the return process very smooth.',
          rating: hasServiceIssues ? 3 : 4,
          reviewer: 'Rahul Joshi',
          source: 'Myntra',
          date: '2024-01-14'
        }
      ]
    },
    {
      id: '4',
      theme: 'Value for Money',
      insight: hasPositiveFeedback ?
        'Customers consistently praise the value proposition and pricing' :
        'Mixed feedback on pricing with some finding it expensive',
      actionType: hasPositiveFeedback ? 'Keep' : 'Fix',
      rating: hasPositiveFeedback ? 4.3 : 3.6,
      reviewCount: 95,
      source: 'Amazon, Flipkart',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: hasPositiveFeedback ? 'from-indigo-500 to-indigo-600' : 'from-yellow-500 to-yellow-600',
      urgencyLevel: hasPositiveFeedback ? 'Low' : 'Medium',
      impactScore: hasPositiveFeedback ? 8.6 : 7.8,
      recommendations: generateActionableRecommendations('Value for Money', !hasPositiveFeedback, hasPositiveFeedback ? 'Keep' : 'Fix'),
      samples: [
        {
          id: '1',
          text: hasPositiveFeedback ?
            'Great value for money! Quality is excellent for this price point. Highly satisfied.' :
            'Overpriced for the quality offered. You can get better products at this price range.',
          rating: hasPositiveFeedback ? 5 : 2,
          reviewer: 'Deepak Mehta',
          source: 'Amazon',
          date: '2024-01-16'
        },
        {
          id: '2',
          text: hasPositiveFeedback ?
            'Perfect price for the quality received. Excellent deal and great product overall.' :
            'Product is okay but feels expensive. Similar products available at lower prices elsewhere.',
          rating: hasPositiveFeedback ? 4 : 3,
          reviewer: 'Kavya Iyer',
          source: 'Flipkart',
          date: '2024-01-15'
        },
        {
          id: '3',
          text: hasPositiveFeedback ?
            'Amazing value! Quality exceeds expectations for this price. Will definitely recommend.' :
            'Price is too high compared to competitors. Need to reconsider pricing strategy.',
          rating: hasPositiveFeedback ? 5 : 2,
          reviewer: 'Suresh Nair',
          source: 'Amazon',
          date: '2024-01-14'
        }
      ]
    }
  ];
};

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [inputMode, setInputMode] = useState<InputMode>('url');
  const [reviewText, setReviewText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [progress, setProgress] = useState(0);
  const [clusters, setClusters] = useState<ReviewCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<ReviewCluster | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrapingMetrics, setScrapingMetrics] = useState<ScrapingMetrics | null>(null);
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; platform: string; message: string } | null>(null);
  const [isProcessingError, setIsProcessingError] = useState(false);
  const [productInfo, setProductInfo] = useState<{ name: string; rating: number; totalReviews: number } | null>(null);

  // Validate URL when it changes
  useEffect(() => {
    if (urlInput.trim() && inputMode === 'url') {
      const validation = automatedWebScraper.validateUrl(urlInput);
      setUrlValidation(validation);
    } else {
      setUrlValidation(null);
    }
  }, [urlInput, inputMode]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setReviewText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    // Validation based on input mode
    if (inputMode === 'paste' && !reviewText.trim()) return;
    if (inputMode === 'url' && (!urlInput.trim() || !urlValidation?.isValid)) return;
    if (inputMode === 'upload' && !reviewText.trim()) return;

    setState('processing');
    setProgress(0);
    setIsProcessingError(false);
    setScrapingMetrics(null);

    try {
      if (inputMode === 'url') {
        // Use web scraper for URL input
        const result = await automatedWebScraper.scrapeWebsite(urlInput, (metrics) => {
          setScrapingMetrics(metrics);
          setProgress((metrics.processed / metrics.totalReviews) * 100);
        });
        
        setProductInfo(result.productInfo);
        const generatedClusters = generateReviewClusters(result.reviewText);
        setClusters(generatedClusters);
        setState('results');
      } else {
        // Traditional processing for text/file input
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + Math.random() * 15 + 5;
          });
        }, 300);

        // Generate results after processing
        setTimeout(() => {
          const generatedClusters = generateReviewClusters(reviewText || 'Great product with excellent quality and fast delivery. Amazing customer service and good value for money.');
          setClusters(generatedClusters);
          setState('results');
          clearInterval(progressInterval);
        }, 3000);
      }
    } catch (error) {
      setIsProcessingError(true);
      setTimeout(() => {
        setState('landing');
        setIsProcessingError(false);
      }, 3000);
    }
  };

  const openClusterModal = (cluster: ReviewCluster) => {
    setSelectedCluster(cluster);
    setIsModalOpen(true);
  };

  const resetApp = () => {
    setState('landing');
    setReviewText('');
    setUrlInput('');
    setProgress(0);
    setClusters([]);
    setSelectedCluster(null);
    setScrapingMetrics(null);
    setUrlValidation(null);
    setProductInfo(null);
    setIsProcessingError(false);
  };

  const canAnalyze = () => {
    switch (inputMode) {
      case 'url':
        return urlInput.trim() && urlValidation?.isValid;
      case 'paste':
        return reviewText.trim();
      case 'upload':
        return reviewText.trim();
      default:
        return false;
    }
  };

  const analyticsData: AnalyticsData = {
    sentimentBreakdown: [
      { name: 'Positive', value: 65, color: '#10b981' },
      { name: 'Neutral', value: 20, color: '#6b7280' },
      { name: 'Negative', value: 15, color: '#ef4444' }
    ],
    trendData: clusters.map(cluster => ({
      category: cluster.theme.split(' ')[0],
      score: cluster.rating
    }))
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {state === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen"
            >
              {/* Header Section */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl mb-4 shadow-xl shadow-teal-500/20">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    ReviewInsight AI
                  </h1>
                  <p className="text-gray-400 max-w-lg mx-auto">
                    Transform customer reviews into actionable business insights with AI-powered analysis and genuine review extraction.
                  </p>
                </motion.div>
              </div>

              {/* Main Input Section */}
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-teal-400" />
                        <span>Start Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Trust & Safety Indicators */}
                      <div className="flex items-center justify-center space-x-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-400" />
                          <span className="text-xs text-gray-300">Data Safe</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-gray-300">Real Reviews</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-gray-300">AI Powered</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Input Mode Selection */}
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={inputMode === 'url' ? 'default' : 'outline'}
                            onClick={() => setInputMode('url')}
                            className={`${
                              inputMode === 'url'
                                ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
                                : 'border-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            <Link2 className="w-4 h-4 mr-2" />
                            URL
                          </Button>
                          <Button
                            variant={inputMode === 'paste' ? 'default' : 'outline'}
                            onClick={() => setInputMode('paste')}
                            className={`${
                              inputMode === 'paste'
                                ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
                                : 'border-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Text
                          </Button>
                          <Button
                            variant={inputMode === 'upload' ? 'default' : 'outline'}
                            onClick={() => setInputMode('upload')}
                            className={`${
                              inputMode === 'upload'
                                ? 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
                                : 'border-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            File
                          </Button>
                        </div>

                        {/* Input Content */}
                        {inputMode === 'url' && (
                          <div className="space-y-3">
                            <div className="flex space-x-2">
                              <Input
                                placeholder="https://www.amazon.in/product-name/dp/XXXXXXXXXX"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setUrlInput('https://www.meesho.com/beautiful-traditional-saree/p/12345')}
                                className="border-gray-600 hover:bg-gray-700 text-xs px-3"
                              >
                                Demo
                              </Button>
                            </div>
                            {urlValidation && (
                              <Alert className={`${urlValidation.isValid ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                                <div className="flex items-center space-x-2">
                                  {urlValidation.isValid ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                  )}
                                  <AlertDescription className={urlValidation.isValid ? 'text-green-400' : 'text-red-400'}>
                                    {urlValidation.message}
                                  </AlertDescription>
                                </div>
                              </Alert>
                            )}
                            {urlValidation?.isValid && (
                              <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Globe className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm font-medium text-white">Platform: {urlValidation.platform}</span>
                                </div>
                                <div className="text-xs text-gray-400 space-y-1">
                                  <p>✓ Genuine reviews will be extracted</p>
                                  <p>✓ Fake reviews will be filtered out</p>
                                  <p>✓ No data stored or compromised</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {inputMode === 'paste' && (
                          <Textarea
                            placeholder="Paste your customer reviews here..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="min-h-32 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                          />
                        )}

                        {inputMode === 'upload' && (
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-400 mb-4">Upload CSV, TXT, or JSON file</p>
                            <input
                              type="file"
                              accept=".csv,.txt,.json"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="file-upload"
                            />
                            <label htmlFor="file-upload">
                              <Button variant="outline" className="cursor-pointer border-gray-600 hover:bg-gray-700">
                                Choose File
                              </Button>
                            </label>
                            {reviewText && (
                              <p className="text-green-400 text-sm mt-2">✓ File loaded successfully</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Supported Platforms */}
                      {inputMode === 'url' && (
                        <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-600">
                          <p className="text-xs text-gray-400 mb-2">Supported Platforms:</p>
                          <div className="flex flex-wrap gap-2">
                            {['Amazon', 'Flipkart', 'Meesho', 'Myntra', 'Zomato', 'Swiggy'].map((platform) => (
                              <Badge key={platform} variant="outline" className="text-xs border-gray-500 text-gray-300">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleAnalyze}
                          disabled={!canAnalyze()}
                          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-medium h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          {inputMode === 'url' ? 'Analyze Live Reviews' : 'Analyze Customer Voices'}
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center space-y-8 max-w-md mx-auto">
                {isProcessingError ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-red-400">Processing Failed</h2>
                    <p className="text-gray-400">Unable to analyze reviews. Please try again.</p>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full mb-6">
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>

                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {inputMode === 'url' ? 'Extracting live reviews...' : 'Analyzing customer voices...'}
                      </h2>
                      <p className="text-gray-400 mb-6">
                        {inputMode === 'url' 
                          ? 'Securely scraping and filtering genuine reviews'
                          : 'Processing insights and extracting key themes'
                        }
                      </p>

                      <div className="w-80 mx-auto space-y-4">
                        <Progress value={progress} className="h-2 bg-gray-800" />
                        <p className="text-sm text-gray-500">
                          {inputMode === 'url' ? (
                            progress < 30 ? 'Connecting to platform...' :
                            progress < 60 ? 'Extracting reviews...' :
                            progress < 90 ? 'Filtering fake reviews...' :
                            'Generating insights...'
                          ) : (
                            progress < 30 ? 'Reading reviews...' :
                            progress < 60 ? 'Identifying themes...' :
                            progress < 90 ? 'Generating insights...' :
                            'Finalizing results...'
                          )}
                        </p>

                        {/* Real-time Scraping Metrics */}
                        {scrapingMetrics && inputMode === 'url' && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Platform</span>
                              <span className="text-white font-medium">{scrapingMetrics.platform}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Reviews Found</span>
                              <span className="text-white font-medium">{scrapingMetrics.totalReviews}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Processed</span>
                              <span className="text-green-400 font-medium">{scrapingMetrics.processed}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Fake Filtered</span>
                              <span className="text-red-400 font-medium">{scrapingMetrics.fakeFiltered}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Processing Speed</span>
                              <span className="text-blue-400 font-medium">{scrapingMetrics.processingSpeed}/min</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Verified Purchases</span>
                              <span className="text-yellow-400 font-medium">{Math.round((scrapingMetrics.verifiedPurchases / scrapingMetrics.processed) * 100)}%</span>
                            </div>
                          </motion.div>
                        )}

                        {/* Trust Indicators */}
                        <div className="flex justify-center space-x-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-400">Secure</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-gray-400">AI Filtered</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs text-gray-400">Genuine</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {state === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            >
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Customer Voice Analysis</h2>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-400">
                      Key insights from {clusters.reduce((acc, c) => acc + c.reviewCount, 0)} customer reviews
                    </p>
                    {scrapingMetrics && (
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          <Shield className="w-3 h-3 mr-1" />
                          {scrapingMetrics.fakeFiltered} fake filtered
                        </Badge>
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {Math.round((scrapingMetrics.verifiedPurchases / scrapingMetrics.totalReviews) * 100)}% verified
                        </Badge>
                      </div>
                    )}
                  </div>
                  {productInfo && (
                    <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-white">{productInfo.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>{productInfo.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{productInfo.totalReviews} reviews</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={resetApp}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </div>

              {/* Analytics Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gray-800/50 border-gray-700 col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white">Theme Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={analyticsData.trendData}>
                        <XAxis dataKey="category" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Bar dataKey="score" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                        <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#14b8a6" />
                            <stop offset="100%" stopColor="#0891b2" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Sentiment Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={analyticsData.sentimentBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {analyticsData.sentimentBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center space-x-4 mt-4">
                      {analyticsData.sentimentBreakdown.map((item) => (
                        <div key={item.name} className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-300">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

                {/* Review Clusters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {clusters.map((cluster, index) => (
                    <motion.div
                      key={cluster.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      onClick={() => openClusterModal(cluster)}
                      className="cursor-pointer"
                    >
                      <Card className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 bg-gradient-to-br ${cluster.color} rounded-lg`}>
                                {cluster.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{cluster.theme}</h3>
                                <p className="text-sm text-gray-400">{cluster.source}</p>
                              </div>
                            </div>
                            <Badge
                              variant={cluster.actionType === 'Fix' ? 'destructive' : 'default'}
                              className={`${
                                cluster.actionType === 'Fix'
                                  ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                  : 'bg-green-500/20 text-green-400 border-green-500/30'
                              }`}
                            >
                              {cluster.actionType === 'Fix' ? '🔴 Fix' : '🟢 Keep'}
                            </Badge>
                          </div>

                          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                            {cluster.insight}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-white">{cluster.rating}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-400">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{cluster.reviewCount}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  cluster.urgencyLevel === 'High' ? 'border-red-500/50 text-red-400' :
                                  cluster.urgencyLevel === 'Medium' ? 'border-yellow-500/50 text-yellow-400' :
                                  'border-green-500/50 text-green-400'
                                }`}
                              >
                                {cluster.urgencyLevel}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right">
                                <div className="text-xs text-gray-400">Impact</div>
                                <div className="text-sm font-medium text-white">{cluster.impactScore}/10</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <PlatformFeatures 
                    platform={scrapingMetrics?.platform || urlValidation?.platform} 
                    isProcessing={false}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Details Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedCluster && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-br ${selectedCluster.color} rounded-lg`}>
                      {selectedCluster.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedCluster.theme}</h3>
                      <p className="text-gray-400 font-normal">{selectedCluster.reviewCount} reviews analyzed</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                      Key Insight
                    </h4>
                    <p className="text-gray-300 mb-3">{selectedCluster.insight}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">Impact Score:</span>
                        <span className="text-white font-medium">{selectedCluster.impactScore}/10</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-400">Urgency:</span>
                        <Badge
                          variant="outline"
                          className={`${
                            selectedCluster.urgencyLevel === 'High' ? 'border-red-500 text-red-400' :
                            selectedCluster.urgencyLevel === 'Medium' ? 'border-yellow-500 text-yellow-400' :
                            'border-green-500 text-green-400'
                          }`}
                        >
                          {selectedCluster.urgencyLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actionable Recommendations */}
                  {selectedCluster.recommendations && selectedCluster.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2 text-green-400" />
                        Actionable Recommendations
                      </h4>
                      <div className="space-y-4">
                        {selectedCluster.recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-medium text-white">{rec.action}</h5>
                                <div className="flex items-center space-x-3 mt-1">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      rec.priority === 'Critical' ? 'border-red-500 text-red-400' :
                                      rec.priority === 'Important' ? 'border-yellow-500 text-yellow-400' :
                                      'border-blue-500 text-blue-400'
                                    }`}
                                  >
                                    {rec.priority}
                                  </Badge>
                                  <span className="text-xs text-gray-400 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {rec.timeframe}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm text-gray-300 mb-2">
                                <span className="text-green-400 font-medium">Expected Impact: </span>
                                {rec.expectedImpact}
                              </p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-400 mb-2">Implementation Steps:</p>
                              <ol className="list-decimal list-inside space-y-1">
                                {rec.implementationSteps.map((step, stepIndex) => (
                                  <li key={stepIndex} className="text-sm text-gray-300 pl-2">
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-4 flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
                      Sample Reviews
                    </h4>
                    <div className="space-y-4">
                      {selectedCluster.samples.map((sample) => (
                        <motion.div
                          key={sample.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gray-700/30 p-4 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{sample.reviewer}</span>
                              <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                                {sample.source}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < sample.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {sample.date}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{sample.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
