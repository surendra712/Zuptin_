import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Platform {
  name: string;
  description: string;
  searchUrl: string;
  directUrl: string;
  color: string;
  icon: string;
}

const PlatformsPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  const platforms: Platform[] = [
    {
      name: 'Blinkit',
      description: 'Quick delivery in 10 minutes',
      searchUrl: 'https://blinkit.com/s/?q=',
      directUrl: 'https://blinkit.com/',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: '⚡'
    },
    {
      name: 'Zepto',
      description: 'Fresh groceries delivered fast',
      searchUrl: 'https://www.zepto.com/search?query=',
      directUrl: 'https://www.zepto.com/',
      color: 'bg-green-600 hover:bg-green-700',
      icon: '🛒'
    },
    {
      name: 'BigBasket',
      description: 'Wide variety of products',
      searchUrl: 'https://www.bigbasket.com/ps/?q=',
      directUrl: 'https://www.bigbasket.com/',
      color: 'bg-orange-600 hover:bg-orange-700',
      icon: '🛍️'
    },
    {
      name: 'Swiggy Instamart',
      description: 'Grocery delivery by Swiggy',
      searchUrl: 'https://www.swiggy.com/search?query=',
      directUrl: 'https://www.swiggy.com/instamart',
      color: 'bg-red-600 hover:bg-red-700',
      icon: '🚚'
    }
  ];

  const handleSearch = () => {
    if (!query.trim()) {
      // If no search query, open all platform direct URLs
      platforms.forEach(platform => {
        window.open(platform.directUrl, '_blank');
      });
      return;
    }
    
    const encodedQuery = encodeURIComponent(query.trim());
    platforms.forEach(platform => {
      window.open(`${platform.searchUrl}${encodedQuery}`, '_blank');
    });
  };

  const handlePlatformSearch = (platform: Platform) => {
    if (!query.trim()) {
      // If no search query, open the direct platform URL
      window.open(platform.directUrl, '_blank');
      return;
    }
    
    const encodedQuery = encodeURIComponent(query.trim());
    window.open(`${platform.searchUrl}${encodedQuery}`, '_blank');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Compare Grocery Prices
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Search across multiple platforms to find the best deals and save money on your grocery shopping
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for milk, rice, oil..."
              className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            />
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors duration-200 shadow-glow"
            >
              {query.trim() ? 'Search All' : 'Visit All'}
            </button>
          </div>
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform, index) => (
            <div
              key={platform.name}
              className="bg-card rounded-lg p-6 border border-border hover:border-border/80 hover:shadow-elegant transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{platform.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{platform.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{platform.description}</p>
                <button
                  onClick={() => handlePlatformSearch(platform)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${platform.color} shadow-sm hover:shadow-md`}
                >
                  {query.trim() ? 'Search' : 'Visit'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Enter your search term above and click "Search All" to compare prices across all platforms, 
            or click individual "Search" buttons to search specific platforms.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlatformsPage;