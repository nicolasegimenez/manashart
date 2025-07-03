# 🐛 MANASHART DEEP DEBUGGING GUIDE

## ✅ CURRENT STATUS
**The application is fully functional with comprehensive debugging tools!**

---

## 🎯 QUICK ACCESS

### URLs
- **Frontend**: http://uzt4z-lp777-77774-qaabq-cai.localhost:4943/
- **Backend Candid**: http://127.0.0.1:4943/?canisterId=u6s2n-gx777-77774-qaaba-cai&id=uxrrr-q7777-77774-qaaaq-cai

### Test User
- **Principal**: `wglbq-n3s36-eqjnp-3yc2v-cncyg-h3lts-cae2k-dy56r-ptabd-x3xv3-dae`
- **Username**: TestUser
- **Vibration**: 95Hz (unlocks SOUL, FLOW, WALLET modules)

---

## 🔬 DEBUGGING FEATURES IMPLEMENTED

### 1. Frontend Debug Panel
- **Access**: Click 🐛 button in bottom-right corner
- **Features**:
  - Real-time state monitoring
  - Connection status indicator
  - Live log streaming
  - Manual test triggers
  - Force login button

### 2. Comprehensive Logging
- **Browser Console**: Detailed logs with timestamps
- **Actor Service**: Step-by-step connection debugging
- **Profile Loading**: Full data flow visibility
- **Error Handling**: Stack traces and context

### 3. Backend Testing
- **Script**: `./deep-test.sh`
- **Coverage**: All methods, edge cases, data flow
- **Validation**: Module unlocking, profile updates, project creation

---

## 🧪 TESTING RESULTS

### ✅ Backend Tests (All Passing)
```
✓ Soul Profile retrieval
✓ Vibration updates (90Hz → 95Hz)
✓ Module unlocking (FLOW, WALLET)
✓ Project creation
✓ User project listing
```

### ✅ Frontend Tests (All Passing)
```
✓ HTTP 200 response
✓ Asset loading
✓ Debug panel functionality
✓ Real-time state updates
```

### ✅ Integration Tests (All Passing)
```
✓ Actor creation
✓ Principal handling
✓ Backend-frontend communication
✓ Error recovery mechanisms
```

---

## 🔍 HOW TO DEBUG ISSUES

### 1. Check Debug Panel
1. Open frontend URL
2. Click 🐛 button
3. Monitor STATES section for anomalies
4. Check RECENT LOGS for errors
5. Use Force Login if needed

### 2. Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for logs starting with:
   - `[DEBUG timestamp]`
   - `[ACTOR DEBUG timestamp]`
4. Expand error objects for details

### 3. Backend Testing
```bash
# Run comprehensive backend test
./deep-test.sh

# Test specific functions
dfx canister call manashart_backend getSoulProfile "(principal \"wglbq-n3s36-eqjnp-3yc2v-cncyg-h3lts-cae2k-dy56r-ptabd-x3xv3-dae\")" --network local
```

### 4. Common Issues & Solutions

#### "Soul profile not found"
- **Cause**: Principal mismatch
- **Fix**: Check debug panel for correct principal
- **Test**: Use Force Login button

#### "Cannot connect to backend"
- **Cause**: Actor creation failure
- **Fix**: Check DFX is running, canister deployed
- **Test**: Run `./test-app.sh`

#### "Module unlock fails"
- **Cause**: Insufficient vibration
- **Fix**: Update vibration with backend call
- **Test**: Use debug panel vibration boost

---

## 🚀 PERFORMANCE OPTIMIZATIONS

### 1. Error Recovery
- Automatic fallback states
- Emergency profile activation
- Graceful degradation

### 2. Debug Mode
- Production: Debug mode disabled by default
- Development: Full logging enabled
- Toggle: Runtime enable/disable

### 3. Connection Management
- Automatic retry mechanisms
- Connection status monitoring
- Root key caching

---

## 📝 MONITORING CHECKLIST

When testing the app, verify:

- [ ] Debug panel loads without errors
- [ ] Connection status shows "CONNECTED"
- [ ] Profile loads with correct data
- [ ] Vibration level matches backend
- [ ] Modules unlock/lock appropriately
- [ ] No red errors in browser console
- [ ] Backend calls complete successfully

---

## 🎭 USER EXPERIENCE TESTING

### Login Flow
1. Visit frontend URL
2. Click "Iniciar Viaje" or "Conectar"
3. Watch debug logs for success
4. Verify profile appears in UI

### Module Testing
1. Check current vibration (should be 95Hz)
2. Try unlocking modules (FLOW, WALLET work)
3. Navigate between modules
4. Verify STORE/STREAM require higher vibration

### Edge Cases
1. Refresh page (should maintain state)
2. Network interruption (should recover)
3. Invalid operations (should show errors)

---

## 🔧 DEVELOPMENT COMMANDS

```bash
# Quick health check
./test-app.sh

# Deep testing
./deep-test.sh

# Rebuild frontend
npm run build --prefix src/manashart_frontend

# Redeploy frontend
echo "yes" | dfx canister install manashart_frontend --mode reinstall --network local

# Update backend
dfx deploy manashart_backend --network local

# Check canister status
dfx canister status manashart_frontend --network local
dfx canister status manashart_backend --network local
```

---
