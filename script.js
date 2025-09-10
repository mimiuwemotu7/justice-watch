// Justice Watch Monitoring Dashboard
class JusticeWatch {
    constructor() {
        this.rssFeeds = [
            // Hate Crimes RSS Feeds
            'https://www.splcenter.org/rss.xml',
            'https://www.adl.org/rss.xml',
            'https://www.fbi.gov/feeds/news/hate-crimes/rss.xml',
            
            // Corruption RSS Feeds
            'https://www.justice.gov/feeds/opa/rss.xml',
            'https://www.sec.gov/news/rss.xml',
            'https://www.fec.gov/feeds/rss.xml',
            
            // Mass Shootings RSS Feeds
            'https://www.gunviolencearchive.org/rss.xml',
            'https://www.everytown.org/rss.xml',
            'https://www.bradyunited.org/rss.xml',
            
            // General News (for broader coverage)
            'https://feeds.bbci.co.uk/news/rss.xml',
            'https://rss.cnn.com/rss/edition.rss',
            'https://feeds.reuters.com/reuters/topNews'
        ];
        
        this.charlieKirkKeywords = [
            'charlie kirk',
            'turning point usa',
            'tp usa',
            'charliekirk',
            'charlie kirk twitter',
            'charlie kirk news',
            'turning point',
            'conservative student',
            'campus conservative',
            'right-wing student',
            'young conservatives',
            'college republicans',
            'student conservative',
            'campus activism',
            'political student group',
            'nepal',
            'nepalese',
            'kathmandu',
            'nepal earthquake',
            'nepal crisis',
            'israel',
            'israeli',
            'israel palestine',
            'israel gaza',
            'israel war',
            'gaza',
            'gaza strip',
            'gaza war',
            'gaza conflict',
            'gaza crisis',
            'palestine',
            'palestinian',
            'west bank',
            'hamas',
            'hezbollah',
            'hate crime',
            'hate crimes',
            'racial violence',
            'race war',
            'racial conflict',
            'white supremacy',
            'white supremacist',
            'neo-nazi',
            'neo nazi',
            'racist attack',
            'racist violence',
            'racial discrimination',
            'ethnic violence',
            'xenophobia',
            'anti-semitism',
            'antisemitism',
            'islamophobia',
            'anti-muslim',
            'anti muslim',
            'anti-black',
            'anti black',
            'anti-asian',
            'anti asian',
            'anti-latino',
            'anti latino',
            'anti-hispanic',
            'anti hispanic',
            'lynching',
            'racial slur',
            'racial slurs',
            'hate speech',
            'hate group',
            'hate groups',
            'extremist attack',
            'terrorist attack',
            'domestic terrorism',
            'white nationalist',
            'white nationalists',
            'alt-right',
            'alt right',
            'far-right',
            'far right',
            'racial tension',
            'racial tensions',
            'race riot',
            'race riots',
            'racial unrest',
            'civil unrest',
            'racial profiling',
            'police brutality',
            'police violence',
            'systemic racism',
            'institutional racism'
        ];
        
        this.init();
    }
    
    init() {
        this.updateTime();
        this.setupEventListeners();
        this.startRSSMonitoring();
        this.generateMockData(); // For demo purposes
        this.startTicker();
        this.initializeViewerCount();
        
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
        
        // Update news every 30 seconds
        setInterval(() => this.updateNews(), 30000);
        
    }
    
    setupEventListeners() {
        // Event listeners can be added here if needed
    }
    
    
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('timeDisplay').textContent = timeString;
    }
    
    startTicker() {
        this.tickerElement = document.getElementById('tickerContent');
        this.newsQueue = [];
        this.currentIndex = 0;
        this.newsFeedItems = [];
        
        // Initialize ticker
        this.tickerElement.textContent = '';
        
        // Start RSS polling
        this.startRSSPolling();
        
        // Start cycling through news items one by one
        this.startNewsCycling();
        
        // Start news feed polling
        this.startNewsFeedPolling();
    }
    
    startRSSPolling() {
        // Poll immediately
        this.fetchRSSFeeds();
        
        // Poll every 30 seconds
        setInterval(() => {
            this.fetchRSSFeeds();
        }, 30000);
    }
    
    async fetchRSSFeeds() {
        console.log('Starting RSS fetch...');
        const sources = [
            {
                url: 'https://feeds.bbci.co.uk/news/rss.xml',
                name: 'BBC News'
            },
            {
                url: 'https://rss.cnn.com/rss/edition.rss',
                name: 'CNN'
            },
            {
                url: 'https://feeds.reuters.com/reuters/topNews',
                name: 'Reuters'
            },
            {
                url: 'https://feeds.npr.org/1001/rss.xml',
                name: 'NPR'
            },
            {
                url: 'https://feeds.feedburner.com/politico/playbook',
                name: 'Politico'
            },
            {
                url: 'https://feeds.feedburner.com/thehill',
                name: 'The Hill'
            },
            {
                url: 'https://feeds.foxnews.com/foxnews/latest',
                name: 'Fox News'
            },
            {
                url: 'https://feeds.washingtonpost.com/rss/world',
                name: 'Washington Post'
            },
            {
                url: 'https://feeds.nytimes.com/nyt/rss/HomePage',
                name: 'New York Times'
            },
            {
                url: 'https://feeds.latimes.com/latimes/news',
                name: 'Los Angeles Times'
            },
            {
                url: 'https://feeds.wsj.com/wsj/news',
                name: 'Wall Street Journal'
            },
            {
                url: 'https://feeds.usatoday.com/usatoday-NewsTopStories',
                name: 'USA Today'
            },
            {
                url: 'https://feeds.nbcnews.com/nbcnews/public/news',
                name: 'NBC News'
            },
            {
                url: 'https://feeds.abcnews.com/abcnews/topstories',
                name: 'ABC News'
            },
            {
                url: 'https://feeds.cbsnews.com/CBSNewsMain',
                name: 'CBS News'
            }
        ];
        
        for (const source of sources) {
            try {
                console.log(`Trying to fetch from ${source.name}...`);
                // Skip RSS2JSON since it's returning 422 errors, go straight to CORS proxy
                await this.fetchViaCORSProxy(source);
                console.log(`Successfully fetched from ${source.name} via proxy`);
            } catch (error) {
                try {
                    console.log(`CORS proxy failed for ${source.name}, trying direct fetch...`);
                    // Method 2: Try direct fetch
                    await this.fetchDirectRSS(source);
                    console.log(`Successfully fetched from ${source.name} via direct`);
                } catch (error2) {
                    console.log(`All methods failed for ${source.name}:`, error2);
                }
            }
        }
        
        console.log(`RSS fetch complete. Total news items: ${this.newsQueue.length}`);
        
        // If no news found, show failure message
        if (this.newsQueue.length === 0) {
            this.tickerElement.textContent = 'FAILED TO FETCH NEWS - RSS FEEDS UNAVAILABLE';
        }
    }
    
    async fetchViaRSS2JSON(source) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&count=5`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const data = await response.json();
            
            if (data.status === 'ok' && data.items) {
                console.log(`Found ${data.items.length} items from ${source.name}`);
                data.items.forEach(item => {
                    const fullText = item.title + ' ' + (item.description || '');
                    if (this.isCharlieKirkRelated(fullText)) {
                        console.log(`Charlie Kirk related item found: ${item.title}`);
                    }
                });
            } else {
                console.log(`RSS2JSON returned status: ${data.status} for ${source.name}`);
            }
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    async fetchViaCORSProxy(source) {
        // Use multiple CORS proxy services as fallbacks
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/',
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://corsproxy.io/?',
            'https://api.codetabs.com/v1/proxy?quest='
        ];
        
        for (const proxy of proxies) {
            let timeoutId;
            try {
                const controller = new AbortController();
                timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
                
                const proxyUrl = proxy + encodeURIComponent(source.url);
                console.log(`Trying proxy: ${proxy} for ${source.name}`);
                
                const response = await fetch(proxyUrl, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
                    }
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const xmlText = await response.text();
                console.log(`Got ${xmlText.length} characters from ${source.name} via ${proxy}`);
                
                // Parse XML
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');
                
                console.log(`Parsed ${items.length} items from ${source.name}`);
                
                items.forEach(item => {
                    const title = item.querySelector('title')?.textContent || '';
                    const description = item.querySelector('description')?.textContent || '';
                    
                    if (this.isCharlieKirkRelated(title + ' ' + description)) {
                        console.log(`Charlie Kirk related item found: ${title}`);
                        this.addNewsItem(title, source.name);
                    }
                });
                
                // If successful, break out of proxy loop
                break;
            } catch (error) {
                if (timeoutId) clearTimeout(timeoutId);
                console.log(`Proxy ${proxy} failed for ${source.name}:`, error.message);
                continue;
            }
        }
    }
    
    async fetchDirectRSS(source) {
        // Try direct fetch (works for some feeds that allow CORS)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        try {
            const response = await fetch(source.url, {
                mode: 'cors',
                headers: {
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            const xmlText = await response.text();
            
            // Parse XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            items.forEach(item => {
                const title = item.querySelector('title')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';
                
                if (this.isCharlieKirkRelated(title + ' ' + description)) {
                    this.addNewsItem(title, source.name);
                }
            });
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
    
    isCharlieKirkRelated(text) {
        const lowerText = text.toLowerCase();
        return this.charlieKirkKeywords.some(keyword => 
            lowerText.includes(keyword.toLowerCase())
        );
    }
    
    addNewsItem(title, source) {
        // Check if already exists
        if (this.newsQueue.some(item => item.title === title)) {
            return;
        }
        
        this.newsQueue.push({
            title: title,
            source: source,
            timestamp: new Date()
        });
        
        // Keep only last 20 items
        if (this.newsQueue.length > 20) {
            this.newsQueue = this.newsQueue.slice(-20);
        }
        
        console.log(`Added news item: ${source} - ${title}`);
        console.log(`Total news items: ${this.newsQueue.length}`);
        
        // Start displaying immediately if this is the first item
        if (this.newsQueue.length === 1) {
            this.cycleToNextNews();
        }
    }
    
    startNewsCycling() {
        // Cycle through news items every 8 seconds
        setInterval(() => {
            this.cycleToNextNews();
        }, 8000);
    }
    
    startNewsFeedPolling() {
        console.log('🚀 Starting news feed polling...');
        
        // Poll immediately
        this.fetchNewsFeed();
        
        // Poll every 10 seconds
        setInterval(() => {
            this.fetchNewsFeed();
        }, 10000);
    }
    
    async fetchNewsFeed() {
        console.log('🔄 Fetching news feed...');
        
        const sources = [
            {
                url: 'https://feeds.bbci.co.uk/news/rss.xml',
                name: 'BBC News'
            },
            {
                url: 'https://rss.cnn.com/rss/edition.rss',
                name: 'CNN'
            },
            {
                url: 'https://feeds.reuters.com/reuters/topNews',
                name: 'Reuters'
            },
            {
                url: 'https://feeds.npr.org/1001/rss.xml',
                name: 'NPR'
            },
            {
                url: 'https://feeds.feedburner.com/politico/playbook',
                name: 'Politico'
            },
            {
                url: 'https://feeds.feedburner.com/thehill',
                name: 'The Hill'
            },
            {
                url: 'https://feeds.foxnews.com/foxnews/latest',
                name: 'Fox News'
            },
            {
                url: 'https://feeds.washingtonpost.com/rss/world',
                name: 'Washington Post'
            },
            {
                url: 'https://feeds.nytimes.com/nyt/rss/HomePage',
                name: 'New York Times'
            },
            {
                url: 'https://feeds.latimes.com/latimes/news',
                name: 'Los Angeles Times'
            },
            {
                url: 'https://feeds.wsj.com/wsj/news',
                name: 'Wall Street Journal'
            },
            {
                url: 'https://feeds.usatoday.com/usatoday-NewsTopStories',
                name: 'USA Today'
            },
            {
                url: 'https://feeds.nbcnews.com/nbcnews/public/news',
                name: 'NBC News'
            },
            {
                url: 'https://feeds.abcnews.com/abcnews/topstories',
                name: 'ABC News'
            },
            {
                url: 'https://feeds.cbsnews.com/CBSNewsMain',
                name: 'CBS News'
            }
        ];
        
        const newItems = [];
        
        for (const source of sources) {
            try {
                console.log(`📡 Fetching from ${source.name}...`);
                await this.fetchNewsFromSource(source, newItems);
            } catch (error) {
                console.log(`❌ Failed to fetch from ${source.name}:`, error);
            }
        }
        
        console.log(`📊 Found ${newItems.length} new news items`);
        
        // Add new items to the top of the list (newest first)
        if (newItems.length > 0) {
            // Sort new items by timestamp (newest first)
            newItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Add new items to the beginning of the array (top of list)
            this.newsFeedItems = [...newItems, ...this.newsFeedItems];
            
            // Remove duplicates based on title
            this.newsFeedItems = this.newsFeedItems.filter((item, index, self) => 
                index === self.findIndex(t => t.title === item.title)
            );
            
            // Keep only last 50 items
            if (this.newsFeedItems.length > 50) {
                this.newsFeedItems = this.newsFeedItems.slice(0, 50);
            }
            
            this.displayNewsFeed();
            console.log(`✅ Added ${newItems.length} new items to news feed. Total items: ${this.newsFeedItems.length}`);
        } else {
            console.log('ℹ️ No new news found');
        }
    }
    
    async fetchNewsFromSource(source, newItems) {
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        
        for (const proxy of proxies) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch(proxy + encodeURIComponent(source.url), {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                
                if (!response.ok) continue;
                
                const xmlText = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                const items = xmlDoc.querySelectorAll('item');
                
                // Get the latest 5 items from each source
                const latestItems = Array.from(items).slice(0, 5);
                
                console.log(`📰 Processing ${latestItems.length} items from ${source.name}`);
                
                latestItems.forEach((item, index) => {
                    const title = item.querySelector('title')?.textContent || '';
                    const description = item.querySelector('description')?.textContent || '';
                    const pubDate = item.querySelector('pubDate')?.textContent || '';
                    const link = item.querySelector('link')?.textContent || '';
                    
                    console.log(`  ${index + 1}. "${title.substring(0, 60)}..."`);
                    
                    // Add ALL news items (no filtering)
                    const newsItem = {
                        priority: this.getPriority(title + ' ' + description),
                        title: title,
                        timestamp: new Date(pubDate || Date.now()),
                        source: source.name,
                        isCharlieKirk: this.isCharlieKirkRelated(title + ' ' + description),
                        link: link
                    };
                    
                    // Only add if it's not already in the list
                    if (!this.newsFeedItems.some(existing => existing.title === title)) {
                        newItems.push(newsItem);
                        console.log(`    ➕ Added to news feed`);
                    } else {
                        console.log(`    ⚠️ Already exists, skipping`);
                    }
                });
                
                break; // If successful, break out of proxy loop
            } catch (error) {
                continue;
            }
        }
    }
    
    displayNewsFeed() {
        const newsList = document.getElementById('newsList');
        
        if (!newsList) {
            console.error('❌ News list element not found!');
            return;
        }
        
        console.log(`📋 Displaying ${this.newsFeedItems.length} news items`);
        
        // Sort news by timestamp (newest first)
        const sortedNews = [...this.newsFeedItems].sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        // Clear existing content
        newsList.innerHTML = '';
        
        if (sortedNews.length === 0) {
            newsList.innerHTML = '<div class="no-news">No news items available</div>';
            return;
        }
        
        // Add items with staggered animation
        sortedNews.forEach((item, index) => {
            const newsElement = this.createNewsFeedElement(item);
            
            // Add animation classes
            newsElement.style.opacity = '0';
            newsElement.style.transform = 'translateY(-20px)';
            newsElement.style.transition = 'all 0.5s ease-out';
            
            newsList.appendChild(newsElement);
            
            // Stagger the animation
            setTimeout(() => {
                newsElement.style.opacity = '1';
                newsElement.style.transform = 'translateY(0)';
            }, index * 50); // 50ms delay between each item
        });
        
        console.log(`✅ Displayed ${sortedNews.length} news items`);
    }
    
    createNewsFeedElement(item) {
        const div = document.createElement('div');
        div.className = `news-item ${item.priority}`;
        
        const priorityTag = document.createElement('div');
        priorityTag.className = `priority-tag ${item.priority}`;
        priorityTag.textContent = `[${item.priority.toUpperCase()}]`;
        
        const title = document.createElement('div');
        title.className = 'news-title';
        title.textContent = item.title;
        
        const meta = document.createElement('div');
        meta.className = 'news-meta';
        meta.innerHTML = `
            <span class="news-source">${item.source}</span>
            <span class="news-time">${this.formatTime(item.timestamp)}</span>
        `;
        
        div.appendChild(priorityTag);
        div.appendChild(title);
        div.appendChild(meta);
        
        // Add click handler for news items
        div.addEventListener('click', () => {
            if (item.link) {
                window.open(item.link, '_blank');
            }
        });
        
        return div;
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
    
    cycleToNextNews() {
        if (this.newsQueue.length === 0) {
            this.tickerElement.textContent = '';
            return;
        }
        
        // Get current news item
        const currentItem = this.newsQueue[this.currentIndex];
        const newText = `${currentItem.source.toUpperCase()}: ${currentItem.title}`;
        
        // Smooth transition: fade out, change text, fade in
        this.tickerElement.style.opacity = '0';
        
        setTimeout(() => {
            this.tickerElement.textContent = newText;
            this.tickerElement.style.opacity = '1';
        }, 250); // Half of the transition time
        
        // Move to next item
        this.currentIndex = (this.currentIndex + 1) % this.newsQueue.length;
        
        console.log(`Cycling to news item ${this.currentIndex}/${this.newsQueue.length}: ${currentItem.title}`);
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        
        if (minutes < 1) return 'JUST NOW';
        if (minutes < 60) return `${minutes}M AGO`;
        if (hours < 24) return `${hours}H AGO`;
        return timestamp.toLocaleDateString();
    }
    
    generateMockData() {
        const mockNews = [
            {
                priority: 'critical',
                title: 'MASS SHOOTING IN TEXAS: 15 DEAD, 20 INJURED IN SCHOOL ATTACK',
                timestamp: new Date(Date.now() - 1000 * 60 * 5),
                source: 'Gun Violence Archive',
                isCharlieKirk: false
            },
            {
                priority: 'charlie-kirk',
                title: 'CHARLIE KIRK SPREADS CONSPIRACY THEORIES ABOUT ELECTION FRAUD',
                timestamp: new Date(Date.now() - 1000 * 60 * 10),
                source: 'Twitter Monitoring',
                isCharlieKirk: true
            },
            {
                priority: 'high',
                title: 'CORRUPTION SCANDAL: SENATOR ACCUSED OF TAKING BRIBES FROM LOBBYISTS',
                timestamp: new Date(Date.now() - 1000 * 60 * 15),
                source: 'DOJ Press Release',
                isCharlieKirk: false
            },
            {
                priority: 'high',
                title: 'HATE CRIME: MOSQUE VANDALIZED WITH SWASTIKAS AND THREATS',
                timestamp: new Date(Date.now() - 1000 * 60 * 20),
                source: 'SPLC Report',
                isCharlieKirk: false
            },
            {
                priority: 'charlie-kirk',
                title: 'CHARLIE KIRK ORGANIZES ANTI-DEMOCRACY RALLY IN FLORIDA',
                timestamp: new Date(Date.now() - 1000 * 60 * 25),
                source: 'Turning Point USA',
                isCharlieKirk: true
            },
            {
                priority: 'critical',
                title: 'MASS SHOOTING IN CALIFORNIA: 8 DEAD IN SHOPPING MALL ATTACK',
                timestamp: new Date(Date.now() - 1000 * 60 * 30),
                source: 'Local Police',
                isCharlieKirk: false
            },
            {
                priority: 'high',
                title: 'CORRUPTION: CITY COUNCIL MEMBER ARRESTED FOR EMBEZZLEMENT',
                timestamp: new Date(Date.now() - 1000 * 60 * 35),
                source: 'FBI Investigation',
                isCharlieKirk: false
            },
            {
                priority: 'low',
                title: 'HATE SPEECH INCIDENT: RACIST GRAFFITI FOUND ON CAMPUS',
                timestamp: new Date(Date.now() - 1000 * 60 * 40),
                source: 'University Security',
                isCharlieKirk: false
            },
            {
                priority: 'charlie-kirk',
                title: 'CHARLIE KIRK PROMOTES ANTI-VAX MISINFORMATION CAMPAIGN',
                timestamp: new Date(Date.now() - 1000 * 60 * 45),
                source: 'Social Media Monitoring',
                isCharlieKirk: true
            },
            {
                priority: 'high',
                title: 'CORRUPTION: JUDGE ACCUSED OF TAKING BRIBES IN DRUG CASE',
                timestamp: new Date(Date.now() - 1000 * 60 * 50),
                source: 'Court Records',
                isCharlieKirk: false
            }
        ];
    }
    
    
    
    
    
    
    async startRSSMonitoring() {
        // In a real implementation, you would fetch RSS feeds here
        // For demo purposes, we'll simulate RSS updates
        console.log('Starting RSS monitoring for justice-related feeds...');
        
        // Simulate RSS feed updates
        setInterval(() => {
            this.simulateRSSUpdate();
        }, 60000); // Update every minute
    }
    
    simulateRSSUpdate() {
        // Simulate new news items coming from RSS feeds
        const newItem = this.generateRandomNewsItem();
        this.newsItems.unshift(newItem);
        
        // Keep only the latest 50 items
        if (this.newsItems.length > 50) {
            this.newsItems = this.newsItems.slice(0, 50);
        }
        
        this.displayNews();
        
        // Note: Ticker now updates automatically via continuous fetching
        
        // Notification popups removed
    }
    
    generateRandomNewsItem() {
        const priorities = ['critical', 'high', 'low'];
        const topics = [
            'Mass shooting incident reported',
            'Hate crime investigation underway',
            'Corruption scandal breaks',
            'Political misconduct exposed',
            'Extremist activity detected',
            'Gun violence statistics updated'
        ];
        
        const sources = [
            'FBI Report',
            'DOJ Press Release',
            'SPLC Alert',
            'Gun Violence Archive',
            'Local Police',
            'Court Records'
        ];
        
        const isCharlieKirk = Math.random() < 0.4; // 40% chance of Charlie Kirk content
        const priority = isCharlieKirk ? 'charlie-kirk' : priorities[Math.floor(Math.random() * priorities.length)];
        
        return {
            priority,
            title: isCharlieKirk ? 
                `CHARLIE KIRK: ${topics[Math.floor(Math.random() * topics.length)].toUpperCase()}` :
                topics[Math.floor(Math.random() * topics.length)].toUpperCase(),
            timestamp: new Date(),
            source: sources[Math.floor(Math.random() * sources.length)],
            isCharlieKirk
        };
    }
    
    // showNewItemNotification method removed
    
    updateNews() {
        // Update feeds active count
        const feedsActive = Math.floor(Math.random() * 3) + 4;
        document.getElementById('feedsActive').textContent = `${feedsActive} FEEDS ACTIVE`;
    }
    
    
    
    
    
    getPriority(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('mass shooting') || lowerText.includes('murder') || lowerText.includes('killed')) {
            return 'critical';
        }
        
        if (lowerText.includes('corruption') || lowerText.includes('arrest') || lowerText.includes('investigation')) {
            return 'high';
        }
        
        return 'low';
    }
    
    initializeViewerCount() {
        // Initialize real-time viewer tracking
        this.viewerCount = 1; // Start with 1 (current user)
        this.updateViewerDisplay();
        
        // Start real viewer tracking system
        this.initializeViewerTracking();
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleUserLeave();
            } else {
                this.handleUserJoin();
            }
        });
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            this.handleUserLeave();
        });
    }
    
    initializeViewerTracking() {
        // Initialize real viewer tracking system
        this.startRealViewerTracking();
    }
    
    // WebSocket connection for future server-based tracking
    connectToWebSocket() {
        // This method is reserved for future server-based WebSocket implementation
        // Currently using localStorage-based tracking for real user counts
        console.log('Using localStorage-based real viewer tracking');
    }
    
    startRealViewerTracking() {
        // Use localStorage to track real users across browser sessions
        this.initializeRealViewerTracking();
        
        // Update viewer count every 2 seconds
        setInterval(() => {
            this.updateRealViewerCount();
        }, 2000);
    }
    
    initializeRealViewerTracking() {
        // Generate unique session ID for this tab
        this.sessionId = this.generateSessionId();
        this.lastActivity = Date.now();
        
        // Get existing viewers from localStorage
        const existingViewers = this.getActiveViewers();
        
        // Add current tab to active viewers
        existingViewers[this.sessionId] = {
            timestamp: this.lastActivity,
            userAgent: navigator.userAgent,
            url: window.location.href,
            tabId: this.sessionId
        };
        
        // Save to localStorage
        this.saveActiveViewers(existingViewers);
        
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'justiceWatchViewers') {
                this.updateRealViewerCount();
            }
        });
        
        // Update activity every 5 seconds
        setInterval(() => {
            this.updateUserActivity();
        }, 5000);
        
        console.log(`Tab session started: ${this.sessionId}`);
    }
    
    updateUserActivity() {
        const activeViewers = this.getActiveViewers();
        
        // Update current user's activity
        if (activeViewers[this.sessionId]) {
            activeViewers[this.sessionId].timestamp = Date.now();
            this.saveActiveViewers(activeViewers);
        }
    }
    
    updateRealViewerCount() {
        const activeViewers = this.getActiveViewers();
        const now = Date.now();
        const timeout = 30000; // 30 seconds timeout
        
        // Remove inactive users (no activity for 30 seconds)
        Object.keys(activeViewers).forEach(sessionId => {
            if (now - activeViewers[sessionId].timestamp > timeout) {
                delete activeViewers[sessionId];
            }
        });
        
        // Save cleaned up viewers
        this.saveActiveViewers(activeViewers);
        
        // Update count
        const newCount = Object.keys(activeViewers).length;
        if (newCount !== this.viewerCount) {
            this.viewerCount = newCount;
            this.updateViewerDisplay();
            console.log(`Real viewer count updated: ${this.viewerCount} active tabs`);
        }
    }
    
    getActiveViewers() {
        try {
            const viewers = localStorage.getItem('justiceWatchViewers');
            return viewers ? JSON.parse(viewers) : {};
        } catch (error) {
            console.log('Error reading viewers from localStorage:', error);
            return {};
        }
    }
    
    saveActiveViewers(viewers) {
        try {
            localStorage.setItem('justiceWatchViewers', JSON.stringify(viewers));
        } catch (error) {
            console.log('Error saving viewers to localStorage:', error);
        }
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    
    updateViewerDisplay() {
        const viewerElement = document.getElementById('viewerCount');
        const viewerDot = document.querySelector('.viewer-dot');
        
        if (viewerElement) {
            viewerElement.textContent = `${this.viewerCount} VIEWER${this.viewerCount > 1 ? 'S' : ''}`;
            
            // Add animation for count changes
            viewerElement.style.transform = 'scale(1.1)';
            viewerElement.style.color = '#00ff00';
            
            setTimeout(() => {
                viewerElement.style.transform = 'scale(1)';
                viewerElement.style.color = '#ffffff';
            }, 300);
        }
        
        // Update dot animation based on viewer count
        if (viewerDot) {
            if (this.viewerCount > 10) {
                viewerDot.style.animation = 'pulse 1s infinite';
                viewerDot.style.background = '#00ff00';
            } else if (this.viewerCount > 5) {
                viewerDot.style.animation = 'pulse 1.5s infinite';
                viewerDot.style.background = '#ffaa00';
            } else {
                viewerDot.style.animation = 'pulse 2s infinite';
                viewerDot.style.background = '#0080ff';
            }
        }
    }
    
    handleUserJoin() {
        // User became active again
        console.log('User became active');
        this.updateUserActivity();
    }
    
    handleUserLeave() {
        // User left this tab - remove this tab from active viewers
        console.log(`Tab ${this.sessionId} left the site`);
        
        if (this.sessionId) {
            const activeViewers = this.getActiveViewers();
            delete activeViewers[this.sessionId];
            this.saveActiveViewers(activeViewers);
            
            // Update count immediately
            this.viewerCount = Object.keys(activeViewers).length;
            this.updateViewerDisplay();
            
            console.log(`Removed tab ${this.sessionId}. Active tabs: ${this.viewerCount}`);
        }
        
        // Send WebSocket message if connected
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ 
                type: 'leave', 
                userId: this.sessionId 
            }));
            this.ws.close();
        }
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the Justice Watch dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JusticeWatch();
});

// Add some additional utility functions
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// Add right-click context menu for additional options
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    const contextMenu = document.createElement('div');
    contextMenu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: #000;
        border: 1px solid #00ff00;
        padding: 10px;
        z-index: 1000;
        font-family: 'Share Tech Mono', monospace;
        font-size: 12px;
    `;
    
    contextMenu.innerHTML = `
        <div style="color: #00ff00; margin-bottom: 5px;">Justice Watch Controls</div>
        <div style="cursor: pointer; padding: 2px;" onclick="document.querySelector('.charlie-kirk-btn').click()">Charlie Kirk Alert</div>
        <div style="cursor: pointer; padding: 2px;" onclick="toggleFullscreen()">Toggle Fullscreen</div>
        <div style="cursor: pointer; padding: 2px;" onclick="this.parentElement.remove()">Close</div>
    `;
    
    document.body.appendChild(contextMenu);
    
    // Remove context menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', () => {
            if (contextMenu.parentElement) {
                contextMenu.remove();
            }
        }, { once: true });
    }, 100);
});
