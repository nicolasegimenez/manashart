#!/bin/bash

echo "🧪 Testing Manashart App..."

# Test backend connection
echo "1. Testing backend connection..."
dfx canister call manashart_backend getSoulProfile "(principal \"wglbq-n3s36-eqjnp-3yc2v-cncyg-h3lts-cae2k-dy56r-ptabd-x3xv3-dae\")" --network local

# Test frontend access
echo "2. Testing frontend access..."
curl -s -o /dev/null -w "%{http_code}" http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/

echo ""
echo "🎯 App URLs:"
echo "Frontend: http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/"
echo "Backend Candid: http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=uxrrr-q7777-77774-qaaaq-cai"

echo ""
echo "👤 Test User Info:"
echo "Username: TestUser"
echo "Vibration: 90Hz"
echo "Principal: wglbq-n3s36-eqjnp-3yc2v-cncyg-h3lts-cae2k-dy56r-ptabd-x3xv3-dae"

echo ""
echo "✅ Ready to test!"