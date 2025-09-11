class JusticeWatch {
    constructor() {
        this.newsQueue = [];
        this.currentNewsIndex = 0;
        this.isAnimating = false;
        this.animationDuration = 5000; // 5 seconds per news item
        this.newsFeedItems = [];
        this.sessionId = this.generateSessionId();
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
        this.startNewsFeedPolling();
        
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

        for (const source of sources) {
            try {
                console.log(`Trying to fetch from ${source.name}...`);
                const newsItems = await this.fetchNewsFromSource(source.url, source.name);
                console.log(`Successfully fetched from ${source.name}`);
                
                // Filter for relevant news
                const relevantNews = newsItems.filter(item => 
                    this.isRelevantNews(item.title, item.description)
                );
                
                relevantNews.forEach(item => {
                    this.addNewsItem(item.title, source.name);
                });
                
            } catch (error) {
                console.error(`Failed to fetch from ${source.name}:`, error);
            }
        }
        
        console.log('RSS fetch complete. Total news items:', this.newsQueue.length);
    }

    async fetchNewsFromSource(url, sourceName) {
        const corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];

        for (const proxy of corsProxies) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(proxy + encodeURIComponent(url), {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/rss+xml, application/xml, text/xml'
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
        
        throw new Error(`All proxies failed for ${sourceName}`);
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
        this.fetchNewsFeed();
        
        // Poll every 10 seconds
        setInterval(() => {
            this.fetchNewsFeed();
        }, 10000);
    }

    async fetchNewsFeed() {
        console.log('Fetching news feed...');
        
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

        for (const source of sources) {
            try {
                const newsItems = await this.fetchNewsFromSource(source.url, source.name);
                
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
                    }
                });
                
            } catch (error) {
                console.error(`Failed to fetch from ${source.name}:`, error);
            }
        }
        
        // Keep only last 50 items
        if (this.newsFeedItems.length > 50) {
            this.newsFeedItems = this.newsFeedItems.slice(-50);
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
        this.updateUserActivity();
        this.startRealViewerTracking();
        this.initializeViewerCount();
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'activeViewers') {
                this.updateRealViewerCount();
            }
        });
        
        // Track user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, () => this.updateUserActivity(), true);
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleUserLeave();
            } else {
                this.updateUserActivity();
            }
        });
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            this.handleUserLeave();
        });
    }

    updateUserActivity() {
        this.lastActivity = Date.now();
        const activeViewers = this.getActiveViewers();
        
        // Update or add current session
        activeViewers[this.sessionId] = {
            lastActivity: this.lastActivity,
            timestamp: Date.now()
        };
        
        this.saveActiveViewers(activeViewers);
        this.updateRealViewerCount();
    }

    startRealViewerTracking() {
        console.log('Starting real viewer tracking...');
        
        // Update viewer count every 5 seconds
        setInterval(() => {
            this.updateRealViewerCount();
        }, 5000);
    }

    updateRealViewerCount() {
        const activeViewers = this.getActiveViewers();
        const now = Date.now();
        const timeout = 30000; // 30 seconds
        
        // Remove inactive viewers
        Object.keys(activeViewers).forEach(sessionId => {
            if (now - activeViewers[sessionId].lastActivity > timeout) {
                delete activeViewers[sessionId];
            }
        });
        
        this.saveActiveViewers(activeViewers);
        
        const viewerCount = Object.keys(activeViewers).length;
        this.displayViewerCount(viewerCount);
        
        console.log(`Active viewers: ${viewerCount}`);
    }

    getActiveViewers() {
        try {
            const stored = localStorage.getItem('activeViewers');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error getting active viewers:', error);
            return {};
        }
    }

    saveActiveViewers(viewers) {
        try {
            localStorage.setItem('activeViewers', JSON.stringify(viewers));
        } catch (error) {
            console.error('Error saving active viewers:', error);
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    handleUserJoin() {
        console.log('User joined:', this.sessionId);
        this.updateUserActivity();
    }

    handleUserLeave() {
        console.log('User left:', this.sessionId);
        const activeViewers = this.getActiveViewers();
        delete activeViewers[this.sessionId];
        this.saveActiveViewers(activeViewers);
        this.updateRealViewerCount();
    }

    displayViewerCount(count) {
        const viewerElement = document.getElementById('viewerCount');
        if (viewerElement) {
            viewerElement.textContent = count;
        }
    }

    initializeViewerCount() {
        this.handleUserJoin();
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
