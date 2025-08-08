const http = require('http');
const fs = require('fs');
const path = require('path');

// Test if the web page exists
const webPagePath = path.join(__dirname, 'public', 'index.html');

if (fs.existsSync(webPagePath)) {
    console.log('✅ Web page exists at:', webPagePath);
    
    // Read and check the content
    const content = fs.readFileSync(webPagePath, 'utf8');
    
    // Check for important elements
    const checks = [
        { name: 'Socket.IO script', pattern: 'socket.io/socket.io.js', found: content.includes('socket.io/socket.io.js') },
        { name: 'WebRTC configuration', pattern: 'RTCPeerConnection', found: content.includes('RTCPeerConnection') },
        { name: 'Channel selection', pattern: 'channel-grid', found: content.includes('channel-grid') },
        { name: 'PTT button', pattern: 'ptt-btn', found: content.includes('ptt-btn') },
        { name: 'Connection status', pattern: 'connectionStatus', found: content.includes('connectionStatus') }
    ];
    
    console.log('\n📋 Web page content check:');
    checks.forEach(check => {
        const status = check.found ? '✅' : '❌';
        console.log(`${status} ${check.name}: ${check.found ? 'Found' : 'Missing'}`);
    });
    
    const allPassed = checks.every(check => check.found);
    console.log(`\n${allPassed ? '✅ All checks passed!' : '❌ Some checks failed!'}`);
    
} else {
    console.log('❌ Web page not found at:', webPagePath);
}

// Test server connectivity
console.log('\n🌐 Testing server connectivity...');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`✅ Server responded with status: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
        console.log('✅ Web page is accessible at http://localhost:3000');
    } else {
        console.log('❌ Server responded but with unexpected status code');
    }
});

req.on('error', (err) => {
    console.log('❌ Server connection failed:', err.message);
    console.log('💡 Make sure the server is running with: npm start');
});

req.end();

console.log('\n📝 Usage Instructions:');
console.log('1. Start the server: npm start');
console.log('2. Open browser: http://localhost:3000');
console.log('3. Grant microphone permission when prompted');
console.log('4. Select a channel and test PTT functionality');
console.log('5. Test with mobile app for cross-platform communication'); 