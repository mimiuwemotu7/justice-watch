class JusticeWatch {
    constructor() {
        this.newsQueue = [];
        this.currentNewsIndex = 0;
        this.isAnimating = false;
        this.animationDuration = 5000; // 5 seconds per news item
        this.newsFeedItems = [];
        this.tabId = this.generateTabId();
        this.lastActivity = Date.now();
        
        // Keywords for filtering news
        this.charlieKirkKeywords = [
            'charlie kirk', 'turning point usa', 'tp usa', 'charliekirk', 'charlie kirk twitter',
            'charlie kirk news', 'turning point', 'conservative student', 'campus conservative',
            'right-wing student', 'young conservatives', 'college republicans', 'student conservative',
            'campus activism', 'political student group',
            'nepal', 'nepalese', 'kathmandu', 'nepal earthquake', 'nepal crisis',
            'israel', 'israeli', 'israel palestine', 'israel gaza', 'israel war',
            'gaza', 'gaza strip', 'gaza war', 'gaza conflict', 'gaza crisis',
            'palestine', 'palestinian', 'west bank', 'hamas', 'hezbollah',
            'hate crime', 'hate crimes', 'racial violence', 'race war', 'racial conflict',
            'white supremacy', 'white supremacist', 'neo-nazi', 'neo nazi', 'racist attack',
            'racist violence', 'racial discrimination', 'ethnic violence', 'xenophobia',
            'anti-semitism', 'antisemitism', 'islamophobia', 'anti-muslim', 'anti muslim',
            'anti-black', 'anti black', 'anti-asian', 'anti asian', 'anti-latino',
            'anti latino', 'anti-hispanic', 'anti hispanic', 'lynching', 'racial slur',
            'racial slurs', 'hate speech', 'hate group', 'hate groups', 'extremist attack',
            'terrorist attack', 'domestic terrorism', 'white nationalist', 'white nationalists',
            'alt-right', 'alt right', 'far-right', 'far right', 'racial tension',
            'racial tensions', 'race riot', 'race riots', 'racial unrest', 'civil unrest',
            'racial profiling', 'police brutality', 'police violence', 'systemic racism',
            'institutional racism'
        ];
        
        this.init();
    }

    init() {
        console.log('Justice Watch initializing...');
        this.startTicker();
        this.initializeViewerTracking();
        this.setupEventListeners();
    }

    startTicker() {
        console.log('Starting RSS monitoring for justice-related feeds...');
        this.newsFeedItems = [];
        this.startNewsFeedPolling();
        this.fetchRSSFeeds();
        
        // Start the ticker cycle
        this.cycleToNextNews();
        
        // Fetch news every 30 seconds
        setInterval(() => {
            this.fetchRSSFeeds();
        }, 30000);
    }

    async fetchRSSFeeds() {
        console.log('Starting RSS fetch...');
        
        const sources = [
            { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
            { name: 'CNN', url: 'https://rss.cnn.com/rss/edition.rss' },
            { name: 'Reuters', url: 'https://feeds.reuters.com/reuters/topNews' },
            { name: 'NPR', url: 'https://feeds.npr.org/1001/rss.xml' },
            { name: 'Politico', url: 'https://feeds.feedburner.com/politico/playbook' },
            { name: 'The Hill', url: 'https://feeds.feedburner.com/thehill' },
            { name: 'Fox News', url: 'https://feeds.foxnews.com/foxnews/latest' },
            { name: 'Washington Post', url: 'https://feeds.washingtonpost.com/rss/world' },
            { name: 'New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
            { name: 'Los Angeles Times', url: 'https://www.latimes.com/world/rss2.0.xml' },
            { name: 'Wall Street Journal', url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml' },
            { name: 'USA Today', url: 'https://rssfeeds.usatoday.com/usatoday-NewsTopStories' },
            { name: 'NBC News', url: 'https://feeds.nbcnews.com/nbcnews/public/news' },
            { name: 'ABC News', url: 'https://abcnews.go.com/abcnews/topstories' },
            { name: 'CBS News', url: 'https://www.cbsnews.com/latest/rss/main' }
        ];

        let totalFetched = 0;
        for (const source of sources) {
            try {
                console.log(`Trying to fetch from ${source.name}...`);
                const newsItems = await this.fetchNewsFromSource(source.url, source.name);
                console.log(`Successfully fetched ${newsItems.length} items from ${source.name}`);
                totalFetched += newsItems.length;
                
                // Filter for relevant news
                const relevantNews = newsItems.filter(item => 
                    this.isRelevantNews(item.title, item.description)
                );
                
                console.log(`Found ${relevantNews.length} relevant items from ${source.name}`);
                
                relevantNews.forEach(item => {
                    this.addNewsItem(item.title, source.name);
                });
                
            } catch (error) {
                console.error(`Failed to fetch from ${source.name}:`, error);
            }
        }
        
        console.log(`RSS fetch complete. Total fetched: ${totalFetched}, News queue: ${this.newsQueue.length}`);
    }

    async fetchNewsFromSource(url, sourceName) {
        const corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://thingproxy.freeboard.io/fetch/',
            'https://cors-anywhere.herokuapp.com/'
        ];

        for (const proxy of corsProxies) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout
                
                let proxyUrl;
                if (proxy.includes('allorigins.win')) {
                    proxyUrl = proxy + encodeURIComponent(url);
                } else if (proxy.includes('codetabs.com')) {
                    proxyUrl = proxy + encodeURIComponent(url);
                } else {
                    proxyUrl = proxy + url;
                }
                
                const response = await fetch(proxyUrl, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/rss+xml, application/xml, text/xml',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const xmlText = await response.text();
                return this.parseRSSFeed(xmlText, sourceName);
                
            } catch (error) {
                console.log(`Proxy ${proxy} failed for ${sourceName}:`, error.message);
                continue;
            }
        }
        
        // Fallback: return mock data if all proxies fail
        console.log(`All proxies failed for ${sourceName}, using fallback data`);
        return this.getFallbackNews(sourceName);
    }

    getFallbackNews(sourceName) {
        const fallbackNews = {
            'BBC News': [
                { title: 'Breaking: Justice Watch monitoring active', description: 'Live monitoring of justice-related news feeds', link: '#', pubDate: new Date().toISOString() },
                { title: 'Latest updates from BBC News', description: 'Stay informed with the latest developments', link: '#', pubDate: new Date().toISOString() }
            ],
            'CNN': [
                { title: 'CNN News Feed Active', description: 'Real-time news monitoring in progress', link: '#', pubDate: new Date().toISOString() },
                { title: 'Justice Watch System Online', description: 'Monitoring justice-related content', link: '#', pubDate: new Date().toISOString() }
            ],
            'Reuters': [
                { title: 'Reuters Feed Monitoring', description: 'Live news feed from Reuters', link: '#', pubDate: new Date().toISOString() }
            ],
            'Fox News': [
                { title: 'Fox News Feed Active', description: 'Live monitoring of Fox News content', link: '#', pubDate: new Date().toISOString() }
            ],
            'NPR': [
                { title: 'NPR News Feed Online', description: 'National Public Radio feed monitoring', link: '#', pubDate: new Date().toISOString() }
            ]
        };
        
        return fallbackNews[sourceName] || [
            { title: `${sourceName} Feed Active`, description: 'News feed monitoring in progress', link: '#', pubDate: new Date().toISOString() }
        ];
    }

    parseRSSFeed(xmlText, sourceName) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        const newsItems = [];
        items.forEach(item => {
            const title = item.querySelector('title')?.textContent || '';
            const description = item.querySelector('description')?.textContent || '';
            const link = item.querySelector('link')?.textContent || '';
            const pubDate = item.querySelector('pubDate')?.textContent || '';
            
            if (title) {
                newsItems.push({
                    title: title.trim(),
                    description: description.trim(),
                    link: link.trim(),
                    pubDate: pubDate.trim(),
                    source: sourceName
                });
            }
        });
        
        return newsItems.slice(0, 5); // Limit to 5 items per source
    }

    isRelevantNews(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        return this.charlieKirkKeywords.some(keyword => 
            text.includes(keyword.toLowerCase())
        );
    }

    addNewsItem(title, source) {
        const newsItem = {
            title: title,
            source: source,
            timestamp: new Date(),
            id: Date.now() + Math.random()
        };
        
        // Add to queue and keep only last 20 items
        this.newsQueue.push(newsItem);
        if (this.newsQueue.length > 20) {
            this.newsQueue.shift();
        }
        
        console.log('Added news item:', title);
        
        // Always trigger ticker update
        this.cycleToNextNews();
    }

    cycleToNextNews() {
        if (this.newsQueue.length === 0) {
            this.displayTickerContent('Scanning for justice-related news...');
            return;
        }
        
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const newsItem = this.newsQueue[this.currentNewsIndex];
        
        this.displayTickerContent(`${newsItem.source}: ${newsItem.title}`);
        
        // Move to next item
        this.currentNewsIndex = (this.currentNewsIndex + 1) % this.newsQueue.length;
        
        // Schedule next cycle
        setTimeout(() => {
            this.isAnimating = false;
            this.cycleToNextNews();
        }, this.animationDuration);
    }

    displayTickerContent(content) {
        const tickerElement = document.getElementById('tickerContent');
        if (tickerElement) {
            tickerElement.textContent = content;
        }
    }

    // News Feed Polling (Sidebar)
    startNewsFeedPolling() {
        console.log('Starting news feed polling...');
        // Load immediately
        this.fetchNewsFeed();
        
        // Poll every 5 seconds for faster updates
        setInterval(() => {
            this.fetchNewsFeed();
        }, 5000);
    }

    async fetchNewsFeed() {
        console.log('Fetching news feed...');
        
        // Use fewer sources for faster loading
        const sources = [
            { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
            { name: 'CNN', url: 'https://rss.cnn.com/rss/edition.rss' },
            { name: 'Reuters', url: 'https://feeds.reuters.com/reuters/topNews' },
            { name: 'Fox News', url: 'https://feeds.foxnews.com/foxnews/latest' },
            { name: 'NPR', url: 'https://feeds.npr.org/1001/rss.xml' }
        ];

        let totalAdded = 0;
        // Fetch from sources in parallel for faster loading
        const fetchPromises = sources.map(async (source) => {
            try {
                console.log(`News feed: Fetching from ${source.name}...`);
                const newsItems = await this.fetchNewsFromSource(source.url, source.name);
                console.log(`News feed: Got ${newsItems.length} items from ${source.name}`);
                
                // Add all news items (no filtering for sidebar)
                newsItems.forEach(item => {
                    const newsItem = {
                        title: item.title,
                        source: source.name,
                        timestamp: new Date(item.pubDate || Date.now()),
                        link: item.link,
                        id: Date.now() + Math.random()
                    };
                    
                    // Check for duplicates
                    const isDuplicate = this.newsFeedItems.some(existing => 
                        existing.title === newsItem.title && existing.source === newsItem.source
                    );
                    
                    if (!isDuplicate) {
                        this.newsFeedItems.push(newsItem);
                        totalAdded++;
                    }
                });
                
            } catch (error) {
                console.error(`News feed: Failed to fetch from ${source.name}:`, error);
            }
        });

        // Wait for all sources to complete
        await Promise.all(fetchPromises);
        
        console.log(`News feed: Added ${totalAdded} new items, total items: ${this.newsFeedItems.length}`);
        
        // Keep only last 30 items for faster processing
        if (this.newsFeedItems.length > 30) {
            this.newsFeedItems = this.newsFeedItems.slice(-30);
        }
        
        // Sort by timestamp (newest first)
        this.newsFeedItems.sort((a, b) => b.timestamp - a.timestamp);
        
        this.displayNewsFeed();
    }

    displayNewsFeed() {
        console.log('Displaying news feed...');
        const newsList = document.getElementById('newsList');
        if (!newsList) {
            console.error('News list element not found');
            return;
        }
        
        // Clear existing content
        newsList.innerHTML = '';
        
        // Display news items with staggered animation
        this.newsFeedItems.slice(0, 10).forEach((item, index) => {
            const newsElement = this.createNewsFeedElement(item);
            newsList.appendChild(newsElement);
            
            // Staggered slide-in animation
            setTimeout(() => {
                newsElement.style.opacity = '1';
                newsElement.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    createNewsFeedElement(item) {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.style.opacity = '0';
        newsElement.style.transform = 'translateX(-20px)';
        newsElement.style.transition = 'all 0.3s ease';
        
        const timeAgo = this.formatTime(item.timestamp);
        
        newsElement.innerHTML = `
            <div class="news-content">
                <h4 class="news-title">${item.title}</h4>
                <div class="news-meta">
                    <span class="news-source">${item.source}</span>
                    <span class="news-time">${timeAgo}</span>
                </div>
            </div>
        `;
        
        // Make clickable if link exists
        if (item.link) {
            newsElement.style.cursor = 'pointer';
            newsElement.addEventListener('click', () => {
                window.open(item.link, '_blank');
            });
        }
        
        return newsElement;
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    // Viewer Count System
    initializeViewerTracking() {
        console.log('Initializing viewer tracking...');
        this.tabId = this.generateTabId();
        this.viewerCount = 1;
        this.initializeWebSocket();
        this.startViewerSimulation();
    }

    generateTabId() {
        return 'tab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeWebSocket() {
        console.log('Initializing WebSocket connection...');
        this.displayViewerCount(this.viewerCount);
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'viewerCount') {
                this.viewerCount = parseInt(e.newValue) || 1;
                this.displayViewerCount(this.viewerCount);
                console.log('Viewer count updated from storage:', this.viewerCount);
            }
        });
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            this.decrementViewerCount();
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.decrementViewerCount();
            } else {
                this.incrementViewerCount();
            }
        });
        
        // Initial increment for this tab
        this.incrementViewerCount();
    }

    startViewerSimulation() {
        console.log('Starting viewer simulation...');
        
        // Simulate realistic viewer count changes every 5 seconds
        setInterval(() => {
            this.simulateViewerChanges();
        }, 5000);
    }

    simulateViewerChanges() {
        const change = Math.random();
        
        if (change < 0.15) {
            // 15% chance to decrease by 1
            if (this.viewerCount > 1) {
                this.decrementViewerCount();
            }
        } else if (change < 0.25) {
            // 10% chance to increase by 1
            this.incrementViewerCount();
        }
        // 75% chance to stay the same
        
        console.log(`Simulated viewer count: ${this.viewerCount}`);
    }

    incrementViewerCount() {
        this.viewerCount++;
        this.saveViewerCount();
        this.displayViewerCount(this.viewerCount);
        console.log('Incremented viewer count:', this.viewerCount);
    }

    decrementViewerCount() {
        if (this.viewerCount > 1) {
            this.viewerCount--;
            this.saveViewerCount();
            this.displayViewerCount(this.viewerCount);
            console.log('Decremented viewer count:', this.viewerCount);
        }
    }

    saveViewerCount() {
        try {
            localStorage.setItem('viewerCount', this.viewerCount.toString());
        } catch (error) {
            console.error('Error saving viewer count:', error);
        }
    }

    displayViewerCount(count) {
        const viewerElement = document.getElementById('viewerCount');
        if (viewerElement) {
            const text = count === 1 ? '1 SITE VIEWER' : `${count} SITE VIEWERS`;
            viewerElement.textContent = text;
        }
    }

    setupEventListeners() {
        // Add any additional event listeners here
        console.log('Event listeners setup complete');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Justice Watch...');
    new JusticeWatch();
});
