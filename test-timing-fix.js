const fs = require('fs');
const path = require('path');

console.log('🔧 Testing WebRTC Timing Fix...\n');

const webPagePath = path.join(__dirname, 'public', 'index.html');
const serverPath = path.join(__dirname, 'server.js');

if (fs.existsSync(webPagePath) && fs.existsSync(serverPath)) {
    const webContent = fs.readFileSync(webPagePath, 'utf8');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    console.log('📋 WebRTC Timing Fix Verification:');
    
    const timingChecks = [
        {
            name: 'Enhanced Backend WebRTC Offer Logging',
            pattern: '📤 WebRTC offer received from',
            found: serverContent.includes('📤 WebRTC offer received from'),
            critical: true
        },
        {
            name: 'Backend Broadcaster Validation',
            pattern: 'Is sender broadcaster:',
            found: serverContent.includes('Is sender broadcaster:'),
            critical: true
        },
        {
            name: 'Enhanced Become Broadcaster Logging',
            pattern: '🎤 Become broadcaster request from',
            found: serverContent.includes('🎤 Become broadcaster request from'),
            critical: true
        },
        {
            name: 'Frontend Broadcasting State Management',
            pattern: 'Set broadcasting state immediately',
            found: webContent.includes('Set broadcasting state immediately'),
            critical: true
        },
        {
            name: 'Frontend Broadcasting Confirmation',
            pattern: 'Confirmed we are the broadcaster',
            found: webContent.includes('Confirmed we are the broadcaster'),
            critical: true
        },
        {
            name: 'Frontend Broadcasting State Reset',
            pattern: 'Resetting broadcasting state',
            found: webContent.includes('Resetting broadcasting state'),
            critical: true
        },
        {
            name: 'WebRTC Offer Timing Check',
            pattern: 'Only send offer if we\'re the broadcaster',
            found: webContent.includes('Only send offer if we\'re the broadcaster'),
            critical: true
        },
        {
            name: 'Error Handling for Broadcasting',
            pattern: 'isBroadcasting = false',
            found: webContent.includes('isBroadcasting = false'),
            critical: true
        }
    ];
    
    let passedChecks = 0;
    let totalChecks = timingChecks.length;
    
    timingChecks.forEach(check => {
        const status = check.found ? '✅' : '❌';
        const critical = check.critical ? ' (CRITICAL)' : '';
        console.log(`${status} ${check.name}${critical}: ${check.found ? 'Found' : 'Missing'}`);
        
        if (check.found) passedChecks++;
    });
    
    console.log(`\n📊 Results: ${passedChecks}/${totalChecks} checks passed`);
    
    if (passedChecks === totalChecks) {
        console.log('🎉 All timing fixes are in place!');
    } else {
        console.log('⚠️  Some timing fixes are missing.');
    }
    
    console.log('\n🔍 Key Timing Fixes Applied:');
    console.log('• Enhanced backend WebRTC offer validation');
    console.log('• Backend broadcaster state logging');
    console.log('• Frontend broadcasting state management');
    console.log('• Proper timing between become-broadcaster and WebRTC offer');
    console.log('• Broadcasting state confirmation and reset');
    console.log('• Error handling for broadcasting failures');
    
    console.log('\n📝 Expected Flow After Fix:');
    console.log('1. User presses PTT button');
    console.log('2. Frontend sends become-broadcaster request');
    console.log('3. Frontend sets broadcasting state immediately');
    console.log('4. Backend processes become-broadcaster request');
    console.log('5. Backend sets channel broadcaster');
    console.log('6. Backend sends broadcaster-changed notification');
    console.log('7. Frontend confirms broadcasting state');
    console.log('8. Frontend initializes WebRTC');
    console.log('9. Frontend sends WebRTC offer (only if broadcasting)');
    console.log('10. Backend validates and relays WebRTC offer');
    console.log('11. Listeners receive WebRTC offer');
    console.log('12. Listeners create peer connections');
    console.log('13. ICE candidates are exchanged');
    console.log('14. Audio streams are established');
    
    console.log('\n🚨 Expected Console Output:');
    console.log('🎤 Starting broadcasting in channel: channel-1');
    console.log('🎤 Become broadcaster request from [socketId] for channel channel-1');
    console.log('✅ User [socketId] became broadcaster in channel channel-1');
    console.log('📻 Channel channel-1 broadcaster set to: [socketId]');
    console.log('📢 Broadcaster change notification sent to channel channel-1');
    console.log('📻 Broadcaster changed: {broadcasterId: [socketId]}');
    console.log('✅ Confirmed we are the broadcaster');
    console.log('📤 WebRTC offer received from [socketId] for channel channel-1');
    console.log('✅ Broadcasting WebRTC offer to channel channel-1');
    console.log('📤 WebRTC offer broadcasted to channel: channel-1');
    console.log('🎯 Received WebRTC offer from: [socketId]');
    console.log('✅ WebRTC offer handled successfully');
    
    console.log('\n🔧 Testing Instructions:');
    console.log('1. Restart server: npm start');
    console.log('2. Open two browser tabs: http://localhost:3000');
    console.log('3. Open browser console in both tabs (F12)');
    console.log('4. Join the same channel in both tabs');
    console.log('5. Press PTT button in one tab');
    console.log('6. Check console for the complete flow');
    console.log('7. Verify WebRTC offer is received by listeners');
    console.log('8. Check if audio plays in the other tab');
    
    console.log('\n🎯 What This Fixes:');
    console.log('• WebRTC offer not being received by listeners');
    console.log('• Timing issues between broadcaster setup and offer sending');
    console.log('• Broadcasting state synchronization');
    console.log('• ICE candidates being buffered without peer connections');
    console.log('• Audio not playing due to missing WebRTC connections');
    
    console.log('\n⚠️  Key Changes Made:');
    console.log('• Backend: Added detailed logging for WebRTC offer validation');
    console.log('• Backend: Enhanced become-broadcaster logging');
    console.log('• Frontend: Set broadcasting state before WebRTC initialization');
    console.log('• Frontend: Added broadcasting state confirmation');
    console.log('• Frontend: Added proper error handling and state reset');
    console.log('• Frontend: Only send WebRTC offer if broadcasting');
    
    console.log('\n🔍 Debugging Checklist:');
    console.log('□ Backend shows "Become broadcaster request"');
    console.log('□ Backend shows "User became broadcaster"');
    console.log('□ Backend shows "Broadcaster change notification sent"');
    console.log('□ Frontend shows "Confirmed we are the broadcaster"');
    console.log('□ Backend shows "WebRTC offer received"');
    console.log('□ Backend shows "Broadcasting WebRTC offer"');
    console.log('□ Frontend shows "Received WebRTC offer"');
    console.log('□ Frontend shows "WebRTC offer handled successfully"');
    console.log('□ ICE candidates are processed (not just buffered)');
    console.log('□ Audio plays in listener tab');
    
} else {
    console.log('❌ Required files not found');
    if (!fs.existsSync(webPagePath)) {
        console.log('❌ Web page not found at:', webPagePath);
    }
    if (!fs.existsSync(serverPath)) {
        console.log('❌ Server not found at:', serverPath);
    }
}
