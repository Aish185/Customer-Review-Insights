import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Filter, Globe, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface PlatformFeaturesProps {
  platform?: string;
  isProcessing?: boolean;
}

export const PlatformFeatures: React.FC<PlatformFeaturesProps> = ({ 
  platform, 
  isProcessing = false 
}) => {
  const features = {
    Amazon: [
      { icon: <Shield className="w-4 h-4" />, text: 'Verified Purchase Filter', color: 'text-green-400' },
      { icon: <Filter className="w-4 h-4" />, text: 'Fake Review Detection', color: 'text-blue-400' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Helpful Vote Analysis', color: 'text-yellow-400' },
      { icon: <Zap className="w-4 h-4" />, text: 'Real-time Extraction', color: 'text-purple-400' }
    ],
    Flipkart: [
      { icon: <Shield className="w-4 h-4" />, text: 'Certified Buyer Filter', color: 'text-green-400' },
      { icon: <Filter className="w-4 h-4" />, text: 'AI Spam Detection', color: 'text-blue-400' },
      { icon: <Globe className="w-4 h-4" />, text: 'Multi-language Support', color: 'text-orange-400' },
      { icon: <Zap className="w-4 h-4" />, text: 'Live Data Sync', color: 'text-purple-400' }
    ],
    Meesho: [
      { icon: <Shield className="w-4 h-4" />, text: 'Authentic Review Check', color: 'text-green-400' },
      { icon: <Filter className="w-4 h-4" />, text: 'Quality Filter System', color: 'text-blue-400' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Regional Analysis', color: 'text-pink-400' },
      { icon: <Zap className="w-4 h-4" />, text: 'Fast Processing', color: 'text-purple-400' }
    ],
    Myntra: [
      { icon: <Shield className="w-4 h-4" />, text: 'Fashion Review Filter', color: 'text-green-400' },
      { icon: <Filter className="w-4 h-4" />, text: 'Size & Fit Analysis', color: 'text-blue-400' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Style Insights', color: 'text-pink-400' },
      { icon: <Zap className="w-4 h-4" />, text: 'Trend Detection', color: 'text-purple-400' }
    ],
    Zomato: [
      { icon: <Shield className="w-4 h-4" />, text: 'Verified Diner Check', color: 'text-green-400' },
      { icon: <Filter className="w-4 h-4" />, text: 'Food Quality Analysis', color: 'text-blue-400' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Service Rating Focus', color: 'text-red-400' },
      { icon: <Zap className="w-4 h-4" />, text: 'Real-time Updates', color: 'text-purple-400' }
    ],
    default: [
      { icon: <Shield className="w-4 h-4" />, text: 'Secure Data Processing', color: 'text-green-400' },
      { icon: <Filter className="w-4 h-4" />, text: 'Advanced AI Filtering', color: 'text-blue-400' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Genuine Review Focus', color: 'text-yellow-400' },
      { icon: <Zap className="w-4 h-4" />, text: 'Lightning Fast Analysis', color: 'text-purple-400' }
    ]
  };

  const currentFeatures = features[platform as keyof typeof features] || features.default;

  const safetyFeatures = [
    'No data stored permanently',
    'Read-only access to public reviews',
    'GDPR compliant processing',
    'Enterprise-grade security'
  ];

  return (
    <div className="space-y-4">
      {/* Platform-Specific Features */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <span>{platform ? `${platform} Features` : 'AI Features'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className={feature.color}>
                {feature.icon}
              </div>
              <span className="text-sm text-gray-300">{feature.text}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Data Safety & Privacy */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Data Safety</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {safetyFeatures.map((safety, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="flex items-center space-x-2"
            >
              <CheckCircle2 className="w-3 h-3 text-green-400" />
              <span className="text-xs text-gray-400">{safety}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <span className="text-sm text-yellow-400">Processing in progress...</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Your data is being processed securely. No information is stored or shared.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Commercial Notice */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs text-blue-400 font-medium">Commercial Use Notice</p>
              <p className="text-xs text-gray-400 mt-1">
                This tool is designed for legitimate business intelligence and market research. 
                Always respect platform terms of service and data usage policies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};