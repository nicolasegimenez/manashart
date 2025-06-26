import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Text "mo:base/Text";

// Import the main actor for testing
import Manashart "canister:manashart_backend";

// Test utilities
module {
    public func describe(description: Text, testFn: () -> async ()) : async () {
        Debug.print("📋 Test Suite: " # description);
        await testFn();
        Debug.print("✅ Test Suite Complete: " # description # "\n");
    };

    public func it(description: Text, testFn: () -> async Bool) : async () {
        Debug.print("  🧪 " # description);
        let result = await testFn();
        if (result) {
            Debug.print("    ✅ PASS");
        } else {
            Debug.print("    ❌ FAIL");
        };
    };

    public func assert(condition: Bool, message: Text) : Bool {
        if (not condition) {
            Debug.print("    💥 Assertion failed: " # message);
        };
        condition
    };

    public func assertEqual<T>(actual: T, expected: T, show: T -> Text) : Bool {
        let actualStr = show(actual);
        let expectedStr = show(expected);
        if (actualStr != expectedStr) {
            Debug.print("    💥 Expected: " # expectedStr # ", got: " # actualStr);
            false
        } else {
            true
        }
    };
}

module SoulProfileTest {
    
    // Mock principal for testing
    let testPrincipal = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");
    
    public func runTests() : async () {
        await describe("Soul Profile Management", func () : async () {
            // Test 1: Create soul profile
            await it("should create a new soul profile", func () : async Bool {
                let result = await Manashart.createSoulProfile("TestUser123");
                switch (result) {
                    case (#ok(profile)) {
                        assert(profile.username == "TestUser123", "Username should match") and
                        assert(profile.vibration == 50, "Initial vibration should be 50") and
                        assert(profile.modules.size() == 5, "Should have 5 modules")
                    };
                    case (#err(error)) {
                        Debug.print("    Error creating profile: " # error);
                        false
                    };
                }
            });

            // Test 2: Prevent duplicate profiles
            await it("should prevent creating duplicate profiles", func () : async Bool {
                let result = await Manashart.createSoulProfile("AnotherUser");
                switch (result) {
                    case (#ok(_)) { false }; // Should not succeed
                    case (#err(error)) {
                        assert(Text.contains(error, #text "already exists"), "Should return 'already exists' error")
                    };
                }
            });

            // Test 3: Get soul profile
            await it("should retrieve existing soul profile", func () : async Bool {
                let profile = await Manashart.getSoulProfile(testPrincipal);
                switch (profile) {
                    case (?userProfile) {
                        assert(userProfile.username == "TestUser123", "Retrieved username should match")
                    };
                    case null {
                        Debug.print("    Profile not found");
                        false
                    };
                }
            });

            // Test 4: Module unlocking with insufficient vibration
            await it("should fail to unlock module with insufficient vibration", func () : async Bool {
                let result = await Manashart.unlockModule("FLOW");
                switch (result) {
                    case (#ok(_)) { false }; // Should not succeed with 50Hz
                    case (#err(error)) {
                        assert(Text.contains(error, #text "Insufficient vibration"), "Should return insufficient vibration error")
                    };
                }
            });
        });
    };
}