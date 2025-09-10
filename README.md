# Justice Watch - Monitoring Dashboard

A real-time monitoring dashboard inspired by the warroom interface, designed to track and prioritize news related to hate crimes, corruption, mass shootings, and Charlie Kirk activities in America.

## Features

### 🚨 Real-time Monitoring
- **Live RSS Feed Monitoring**: Tracks multiple RSS feeds for justice-related news
- **Priority System**: Categorizes news by priority levels (Critical, High, Low, Charlie Kirk)
- **Real-time Updates**: News feed updates every 30 seconds with live indicators

### 🎯 Charlie Kirk Priority Tracking
- **Special Monitoring**: Charlie Kirk content gets highest priority with distinctive purple highlighting
- **Alert System**: Immediate notifications for Charlie Kirk related activities
- **Dedicated Button**: Quick access to filter and view all Charlie Kirk content

### 📊 Dashboard Interface
- **Warroom Aesthetic**: Dark theme with neon green and red accents
- **News Feed Panel**: Left sidebar showing prioritized news items
- **Video Grid**: Main content area with location-based monitoring
- **Live Ticker**: Scrolling news ticker with rotating messages
- **Status Bar**: Bottom bar showing system status and controls

### 🎮 Interactive Features
- **Clickable News Items**: Click any news item for detailed information
- **View Controls**: Toggle between Grid View and Freeform View
- **Keyboard Shortcuts**: 
  - `Ctrl + K`: Trigger Charlie Kirk alert
  - `F11`: Toggle fullscreen mode
- **Right-click Menu**: Context menu with additional controls

## RSS Feeds Monitored

### Hate Crimes
- Southern Poverty Law Center (SPLC)
- Anti-Defamation League (ADL)
- FBI Hate Crimes Reports

### Corruption
- Department of Justice Press Releases
- SEC Enforcement Actions
- FEC Violations

### Mass Shootings
- Gun Violence Archive
- Everytown for Gun Safety
- Brady United

### General News
- BBC News
- CNN
- Reuters

## Priority Levels

1. **Charlie Kirk** (Purple) - Highest priority, special monitoring
2. **Critical** (Red) - Mass shootings, major corruption, severe hate crimes
3. **High** (Orange) - Significant incidents requiring attention
4. **Low** (White) - General news and minor incidents

## Installation & Usage

1. **Clone or Download**: Save all files to a local directory
2. **Open in Browser**: Open `index.html` in any modern web browser
3. **Start Monitoring**: The dashboard will automatically begin monitoring feeds

### File Structure
```
justice-watch/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Advanced styling with animations and responsive design
- **JavaScript ES6+**: Modern JavaScript with classes and async/await
- **Google Fonts**: Orbitron and Share Tech Mono for futuristic typography

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Responsive Design
- Desktop optimized (1200px+)
- Tablet support (768px - 1199px)
- Mobile responsive (below 768px)

## Customization

### Adding New RSS Feeds
Edit the `rssFeeds` array in `script.js`:
```javascript
this.rssFeeds = [
    'https://your-rss-feed-url.com/rss.xml',
    // ... existing feeds
];
```

### Modifying Charlie Kirk Keywords
Update the `charlieKirkKeywords` array in `script.js`:
```javascript
this.charlieKirkKeywords = [
    'charlie kirk',
    'your custom keyword',
    // ... existing keywords
];
```

### Changing Priority Colors
Modify the CSS color variables in `styles.css`:
```css
.news-item.charlie-kirk {
    border-left-color: #ff00ff; /* Change this color */
    background: rgba(255, 0, 255, 0.15);
}
```

## Security & Privacy

- **No Data Collection**: All monitoring is done client-side
- **No External APIs**: Uses only RSS feeds and local functionality
- **Privacy Focused**: No user data is stored or transmitted

## Legal Disclaimer

This tool is for educational and monitoring purposes only. Users are responsible for ensuring compliance with all applicable laws and regulations regarding data collection and monitoring activities.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the Justice Watch dashboard.

## License

This project is open source and available under the MIT License.
