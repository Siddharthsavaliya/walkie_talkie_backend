const fs = require('fs');
const path = require('path');

console.log('🔧 Testing Audio Fixes v2 in Web Interface...\n');

const webPagePath = path.join(__dirname, 'public', 'index.html');

if (fs.existsSync(webPagePath)) {
    const content = fs.readFileSync(webPagePath, 'utf8');
    
    console.log('📋 Audio Fix v2 Verification:');
    
    const audioChecks = [
        {
            name: 'Multiple Peer Connections Map',
            pattern: 'peerConnections = new Map()',
            found: content.includes('peerConnections = new Map()'),
            critical: true
        },
        {
            name: 'Multiple Remote Streams Map',
            pattern: 'remoteStreams = new Map()',
            found: content.includes('remoteStreams = new Map()'),
            critical: true
        },
        {
            name: 'Enhanced WebRTC Offer Handling',
            pattern: 'peerConnections.set(data.fromId, peerConnection)',
            found: content.includes('peerConnections.set(data.fromId, peerConnection)'),
            critical: true
        },
        {
            name: 'Enhanced Audio Playback Function',
            pattern: 'function playRemoteAudio(stream, fromId',
            found: content.includes('function playRemoteAudio(stream, fromId'),
            critical: true
        },
        {
            name: 'Enhanced ICE Candidate Handling',
            pattern: 'targetConnection = peerConnections.get(data.fromId)',
            found: content.includes('targetConnection = peerConnections.get(data.fromId)'),
            critical: true
        },
        {
            name: 'Enhanced Cleanup Function',
            pattern: 'peerConnections.forEach((connection, id)',
            found: content.includes('peerConnections.forEach((connection, id)'),
            critical: true
        },
        {
            name: 'Manual Audio Test Button',
            pattern: 'manualAudioTestBtn',
            found: content.includes('manualAudioTestBtn'),
            critical: true
        },
        {
            name: 'Enhanced Console Logging',
            pattern: 'console.log(\'Remote audio stream received from:\'',
            found: content.includes('console.log(\'Remote audio stream received from:\''),
            critical: false
        }
    ];
    
    let passedChecks = 0;
    let totalChecks = audioChecks.length;
    
    audioChecks.forEach(check => {
        const status = check.found ? '✅' : '❌';
        const critical = check.critical ? ' (CRITICAL)' : '';
        console.log(`${status} ${check.name}${critical}: ${check.found ? 'Found' : 'Missing'}`);
        
        if (check.found) passedChecks++;
    });
    
    console.log(`\n📊 Results: ${passedChecks}/${totalChecks} checks passed`);
    
    if (passedChecks === totalChecks) {
        console.log('🎉 All audio fixes v2 are in place!');
    } else {
        console.log('⚠️  Some audio fixes v2 are missing.');
    }
    
    console.log('\n🔍 Key Audio Improvements v2:');
    console.log('• Multiple peer connection management');
    console.log('• Multiple remote stream handling');
    console.log('• Enhanced WebRTC offer/answer handling');
    console.log('• Better ICE candidate routing');
    console.log('• Improved audio element management');
    console.log('• Manual audio test for debugging');
    console.log('• Enhanced console logging for debugging');
    
    console.log('\n📝 Testing Instructions:');
    console.log('1. Start server: npm start');
    console.log('2. Open browser: http://localhost:3000');
    console.log('3. Click "🔊 Test Audio" to verify microphone access');
    console.log('4. Click "🎵 Manual Audio Test" to verify audio playback');
    console.log('5. Join a channel and test PTT functionality');
    console.log('6. Check browser console for detailed WebRTC logs');
    
    console.log('\n🚨 Debugging Steps:');
    console.log('1. Open browser console (F12)');
    console.log('2. Look for WebRTC connection logs');
    console.log('3. Check for "Remote audio stream received" messages');
    console.log('4. Verify audio permissions are granted');
    console.log('5. Test with multiple browser tabs');
    
} else {
    console.log('❌ Web page not found at:', webPagePath);
} 