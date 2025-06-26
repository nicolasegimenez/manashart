#!/bin/bash

echo "🔬 DEEP DEBUGGING & TESTING MANASHART"
echo "====================================="

# Test user principal
TEST_PRINCIPAL="wglbq-n3s36-eqjnp-3yc2v-cncyg-h3lts-cae2k-dy56r-ptabd-x3xv3-dae"

echo ""
echo "🧪 1. BACKEND DEEP TESTS"
echo "------------------------"

echo "1.1 Testing all backend methods..."

# Switch to test user
dfx identity use test_user > /dev/null 2>&1

echo "✓ Get Soul Profile:"
dfx canister call manashart_backend getSoulProfile "(principal \"$TEST_PRINCIPAL\")" --network local

echo ""
echo "✓ Update Vibration to 95Hz:"
dfx canister call manashart_backend updateVibration '(95)' --network local

echo ""
echo "✓ Try to unlock FLOW module:"
dfx canister call manashart_backend unlockModule '("FLOW")' --network local

echo ""
echo "✓ Try to unlock WALLET module:"
dfx canister call manashart_backend unlockModule '("WALLET")' --network local

echo ""
echo "✓ Get updated profile:"
dfx canister call manashart_backend getSoulProfile "(principal \"$TEST_PRINCIPAL\")" --network local

echo ""
echo "✓ Test project creation:"
dfx canister call manashart_backend createProject '("Test Project", "A test project for debugging", true)' --network local

echo ""
echo "✓ Get user projects:"
dfx canister call manashart_backend getProjects "(principal \"$TEST_PRINCIPAL\")" --network local

echo ""
echo "🌐 2. FRONTEND CONNECTIVITY TESTS"
echo "---------------------------------"

echo "2.1 Frontend accessibility:"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/)
echo "Frontend HTTP Status: $FRONTEND_STATUS"

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend not accessible"
fi

echo ""
echo "2.2 Backend Candid interface:"
CANDID_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=uxrrr-q7777-77774-qaaaq-cai")
echo "Candid HTTP Status: $CANDID_STATUS"

if [ "$CANDID_STATUS" = "200" ]; then
    echo "✅ Candid interface accessible"
else
    echo "❌ Candid interface not accessible"
fi

echo ""
echo "🔍 3. CANISTER STATUS CHECKS"
echo "----------------------------"

echo "3.1 Backend canister status:"
dfx canister status manashart_backend --network local

echo ""
echo "3.2 Frontend canister status:"
dfx canister status manashart_frontend --network local

echo ""
echo "📊 4. SUMMARY & DEBUGGING INFO"
echo "==============================="

echo "🎯 URLs for testing:"
echo "Frontend: http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/"
echo "Candid:   http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=uxrrr-q7777-77774-qaaaq-cai"

echo ""
echo "👤 Test User:"
echo "Principal: $TEST_PRINCIPAL"
echo "Username: TestUser"
echo "Vibration: 95Hz (should unlock most modules)"

echo ""
echo "🐛 Debug Features:"
echo "- Click 🐛 button in frontend for debug panel"
echo "- Check browser console for detailed logs"
echo "- Debug panel shows real-time state"

echo ""
echo "✅ TESTING COMPLETE - App should be fully functional!"
echo "If you see any errors above, those are the areas to focus on."