interface ScrapingMetrics {
  totalReviews: number;
  processed: number;
  fakeFiltered: number;
  averageRating: number;
  platform: string;
  processingSpeed: number;
  verifiedPurchases: number;
}

interface ScrapingResult {
  reviewText: string;
  platform: string;
  productInfo: {
    name: string;
    rating: number;
    totalReviews: number;
  };
}

class AutomatedWebScraper {
  private platformPatterns = {
    amazon: /amazon\.(com|in|co\.uk)/,
    flipkart: /flipkart\.com/,
    meesho: /meesho\.com/,
    myntra: /myntra\.com/,
    zomato: /zomato\.com/,
    swiggy: /swiggy\.com/,
    nykaa: /nykaa\.com/,
    ajio: /ajio\.com/
  };

  private detectPlatform(url: string): string {
    for (const [platform, pattern] of Object.entries(this.platformPatterns)) {
      if (pattern.test(url)) {
        return platform.charAt(0).toUpperCase() + platform.slice(1);
      }
    }
    return 'Generic E-commerce';
  }

  private generateMockReviews(platform: string): string[] {
    const platformReviews = {
      Amazon: [
        "Great product! Fast delivery and excellent packaging. The quality exceeded my expectations.",
        "Good value for money. The item arrived on time and matches the description perfectly.",
        "Disappointed with the quality. The material feels cheap and doesn't look like the pictures.",
        "Outstanding customer service. They resolved my issue quickly and professionally.",
        "The product is okay but delivery was delayed by 3 days. Packaging could be better.",
        "Amazing quality! I'm very satisfied with this purchase. Highly recommend to others.",
        "Poor quality control. The item had minor defects but still usable.",
        "Fast shipping and great customer support. Will definitely buy again from this seller.",
        "The product description was misleading. The actual size is smaller than expected.",
        "Excellent build quality and fantastic design. Worth every penny spent.",
        "Late delivery and poor packaging. The item was damaged during shipping.",
        "Good product but overpriced. You can find similar items for much less.",
        "Perfect fit and great material. The color matches exactly as shown in photos.",
        "Customer service was unhelpful when I tried to return the defective item.",
        "High quality product with premium feel. The packaging was also very impressive."
      ],
      Flipkart: [
        "Superb quality and fast delivery! The product exceeded my expectations completely.",
        "Good packaging and the item was delivered safely. Quality is as expected.",
        "The product quality is average. It's okay for the price but nothing special.",
        "Excellent customer service and quick resolution of my queries. Very professional.",
        "Delivery was on time but the product had some quality issues. Disappointed.",
        "Amazing value for money! The features and quality are beyond my expectations.",
        "Poor packaging led to damage during transit. Need to improve shipping methods.",
        "Great shopping experience overall. The product quality and service were excellent.",
        "The description didn't match the actual product. The size was different.",
        "Outstanding quality and design. I'm very happy with this purchase decision.",
        "Late delivery and no proper tracking updates. Communication needs improvement.",
        "Good product but the price keeps fluctuating. Should maintain stable pricing.",
        "Perfect product with excellent build quality. The delivery was also very fast.",
        "Return process was complicated and customer service wasn't very helpful.",
        "High-quality material and excellent craftsmanship. Definitely worth the money."
      ],
      Meesho: [
        "Beautiful saree with excellent fabric quality! The colors are vibrant and true to pictures.",
        "Good quality material and reasonable price. The blouse piece quality is also nice.",
        "The saree is gorgeous but delivery took longer than expected. Overall satisfied.",
        "Amazing design and comfortable fabric. Perfect for festivals and special occasions.",
        "Quality is decent for the price. The border work is beautiful and well-finished.",
        "Excellent packaging and fast delivery. The saree looks exactly like the photos.",
        "The fabric quality could be better. It's okay but not as premium as expected.",
        "Great customer support and easy return policy. The saree quality is also good.",
        "Beautiful colors and pattern but the material feels slightly rough. Average quality.",
        "Outstanding value for money! The embroidery work is intricate and beautiful.",
        "Delayed delivery and poor communication. The product quality is just average.",
        "Good quality saree with nice finish. The blouse material is also of good quality.",
        "Perfect traditional wear with authentic look. The craftsmanship is commendable.",
        "Return process was smooth and hassle-free. Customer service was very helpful.",
        "Excellent traditional design with modern touch. The fabric drape is perfect."
      ],
      Myntra: [
        "Trendy design and excellent fabric quality! Perfect fit and comfortable to wear.",
        "Good collection of fashionable clothes. The quality matches the price point well.",
        "The dress looks different from the website photos. The color is not as vibrant.",
        "Great fashion choices and quick delivery. The sizing guide is also accurate.",
        "Quality is inconsistent across different brands. Some are excellent, others average.",
        "Amazing style and perfect for casual wear. The material is soft and comfortable.",
        "Poor quality control. The stitching was loose and the fit was awkward.",
        "Excellent customer service and easy exchanges. The fashion collection is trendy.",
        "The product quality varies by brand. Always check reviews before purchasing.",
        "Outstanding fashion sense and modern designs. Quality is generally very good.",
        "Delivery was delayed and packaging could be more eco-friendly. Product is good.",
        "Good variety of brands and styles. The app interface is user-friendly too.",
        "Perfect casual wear with great comfort. The material quality is impressive.",
        "Return policy is customer-friendly. The quality of branded items is excellent.",
        "High-quality fashion items with contemporary designs. Great shopping experience."
      ],
      Zomato: [
        "Delicious food and timely delivery! The restaurant maintains excellent taste and quality.",
        "Good food quality but delivery was a bit delayed. Overall satisfactory experience.",
        "The taste was below expectations and the portion size was quite small for the price.",
        "Excellent service and hot food delivery. The packaging keeps the food fresh.",
        "Quality varies by restaurant. Some deliver amazing food while others are average.",
        "Amazing taste and authentic flavors! The delivery was quick and food was hot.",
        "Poor food quality and cold delivery. The restaurant needs to improve standards.",
        "Great customer support and quick refunds for issues. Food quality is generally good.",
        "The food arrived spilled and messy. Packaging needs significant improvement.",
        "Outstanding taste and restaurant-quality food delivered to home. Very satisfied.",
        "Late delivery and wrong order received. Customer service resolved it quickly though.",
        "Good variety of restaurants and cuisines. The food quality is usually consistent.",
        "Perfect food delivery service with hot and fresh meals. Highly recommended.",
        "The delivery person was courteous and the food arrived in perfect condition.",
        "High-quality ingredients and authentic taste. The packaging is also eco-friendly."
      ]
    };

    return platformReviews[platform] || platformReviews.Amazon;
  }

  async scrapeWebsite(
    url: string,
    onProgress: (metrics: ScrapingMetrics) => void
  ): Promise<ScrapingResult> {
    const platform = this.detectPlatform(url);
    const mockReviews = this.generateMockReviews(platform);
    
    // Simulate realistic scraping progress with faster completion
    const totalReviews = Math.floor(Math.random() * 100) + 80; // 80-180 reviews
    let processed = 0;
    let fakeFiltered = 0;

    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        reject(new Error('Scraping operation timed out'));
      }, 12000); // 12 second timeout

      const interval = setInterval(() => {
        processed += Math.floor(Math.random() * 12) + 8; // Process 8-20 reviews per update
        fakeFiltered += Math.floor(Math.random() * 2); // Filter some fake reviews
        
        if (processed >= totalReviews) {
          processed = totalReviews;
          clearInterval(interval);
          clearTimeout(timeout);
          
          // Final metrics
          const finalMetrics = {
            totalReviews,
            processed,
            fakeFiltered,
            averageRating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0
            platform,
            processingSpeed: Math.floor(Math.random() * 25) + 45, // 45-70 reviews/min
            verifiedPurchases: Math.floor(totalReviews * (0.75 + Math.random() * 0.2)) // 75-95%
          };

          onProgress(finalMetrics);

          // Return combined review text
          const reviewText = mockReviews
            .concat(mockReviews.slice(0, Math.floor(mockReviews.length / 2))) // Add some variety
            .slice(0, Math.min(totalReviews, 80))
            .join('\n\n');

          resolve({
            reviewText,
            platform,
            productInfo: {
              name: platform === 'Meesho' ? 'Beautiful Traditional Saree' : 
                     platform === 'Zomato' ? 'Restaurant Reviews' :
                     'Sample Product',
              rating: finalMetrics.averageRating,
              totalReviews
            }
          });
        } else {
          onProgress({
            totalReviews,
            processed,
            fakeFiltered,
            averageRating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
            platform,
            processingSpeed: Math.floor(Math.random() * 25) + 45,
            verifiedPurchases: Math.floor(processed * (0.75 + Math.random() * 0.2))
          });
        }
      }, 250); // Update every 250ms for smooth progress
    });
  }

  // Validate if URL belongs to supported platforms
  validateUrl(url: string): { isValid: boolean; platform: string; message: string } {
    try {
      const urlObj = new URL(url);
      const platform = this.detectPlatform(url);
      
      if (platform === 'Generic E-commerce') {
        return {
          isValid: false,
          platform: 'Unknown',
          message: 'Platform not supported. Please use Amazon, Flipkart, Meesho, Myntra, Zomato, or Swiggy URLs.'
        };
      }

      return {
        isValid: true,
        platform,
        message: `Ready to analyze reviews from ${platform}`
      };
    } catch {
      return {
        isValid: false,
        platform: 'Invalid',
        message: 'Please enter a valid URL'
      };
    }
  }

  // Get platform-specific scraping instructions
  getScrapingInstructions(platform: string): string[] {
    const instructions = {
      Amazon: [
        'Navigate to the product page',
        'Scroll down to customer reviews section',
        'Click on "See all customer reviews"',
        'Extract review text, ratings, and helpful votes'
      ],
      Flipkart: [
        'Go to product page',
        'Find "Ratings & Reviews" section',
        'Click "All Reviews" to see complete list',
        'Extract review content and ratings'
      ],
      Meesho: [
        'Open product page',
        'Scroll to "Reviews & Ratings" section',
        'View all customer reviews and ratings',
        'Extract review text and star ratings'
      ],
      Myntra: [
        'Visit product page',
        'Navigate to "Customer Reviews" tab',
        'Read through all available reviews',
        'Collect review text and ratings data'
      ],
      Zomato: [
        'Go to restaurant page',
        'Click on "Reviews" tab',
        'Read customer reviews and ratings',
        'Extract review content and star ratings'
      ]
    };

    return instructions[platform] || instructions.Amazon;
  }
}

export const automatedWebScraper = new AutomatedWebScraper();