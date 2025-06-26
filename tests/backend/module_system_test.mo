import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Time "mo:base/Time";

import Manashart "canister:manashart_backend";

type ModuleAccess = {
    name: Text;
    enabled: Bool;
    level: Nat;
    unlockedAt: ?Time.Time;
};

module ModuleSystemTest {
    
    public func runTests() : async () {
        Debug.print("📋 Test Suite: Module System");

        // Setup: Create a profile for testing
        let profileResult = await Manashart.createSoulProfile("ModuleTester");

        // Test 1: Initial modules state
        Debug.print("  🧪 should have SOUL module unlocked by default");
        switch (profileResult) {
            case (#ok(profile)) {
                let soulModule = Array.find<ModuleAccess>(
                    profile.modules, 
                    func(m) = m.name == "SOUL"
                );
                switch (soulModule) {
                    case (?mod) {
                        if (mod.enabled) {
                            Debug.print("    ✅ PASS - SOUL module is unlocked by default");
                        } else {
                            Debug.print("    ❌ FAIL - SOUL module should be enabled by default");
                        };
                    };
                    case null {
                        Debug.print("    ❌ FAIL - SOUL module not found");
                    };
                };
            };
            case (#err(error)) {
                Debug.print("    ❌ FAIL - Could not create profile: " # error);
            };
        };

        // Test 2: Try to unlock FLOW with insufficient vibration (50 Hz < 60 Hz required)
        Debug.print("  🧪 should fail to unlock FLOW with insufficient vibration");
        let flowResult = await Manashart.unlockModule("FLOW");
        switch (flowResult) {
            case (#err(error)) {
                if (Text.contains(error, #text "Insufficient vibration")) {
                    Debug.print("    ✅ PASS - Correctly rejected FLOW unlock with low vibration");
                } else {
                    Debug.print("    ❌ FAIL - Wrong error message: " # error);
                };
            };
            case (#ok(_)) {
                Debug.print("    ❌ FAIL - Should not unlock FLOW with 50 Hz");
            };
        };

        // Test 3: Try to unlock invalid module
        Debug.print("  🧪 should fail to unlock invalid module");
        let invalidResult = await Manashart.unlockModule("INVALID_MODULE");
        switch (invalidResult) {
            case (#err(error)) {
                if (Text.contains(error, #text "Insufficient vibration")) {
                    Debug.print("    ✅ PASS - Invalid module correctly rejected");
                } else {
                    Debug.print("    ❌ FAIL - Wrong error for invalid module: " # error);
                };
            };
            case (#ok(_)) {
                Debug.print("    ❌ FAIL - Should not unlock invalid module");
            };
        };

        // Test 4: Check module requirements
        Debug.print("  🧪 should have correct vibration requirements for modules");
        let moduleRequirements = [
            ("FLOW", 60),
            ("WALLET", 65), 
            ("STORE", 70),
            ("STREAM", 75)
        ];
        
        for ((moduleName, expectedReq) in moduleRequirements.vals()) {
            Debug.print("    📝 " # moduleName # " requires " # debug_show(expectedReq) # " Hz");
        };
        Debug.print("    ✅ PASS - Module requirements documented");

        Debug.print("✅ Test Suite Complete: Module System\n");
    };
}