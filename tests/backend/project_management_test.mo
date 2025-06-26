import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Text "mo:base/Text";

import Manashart "canister:manashart_backend";

module ProjectManagementTest {
    
    // Mock principal for testing
    let testPrincipal = Principal.fromText("rdmx6-jaaaa-aaaah-qcaiq-cai");
    
    public func runTests() : async () {
        Debug.print("📋 Test Suite: Project Management");

        // Setup: Create a soul profile first
        let profileResult = await Manashart.createSoulProfile("ProjectTester");
        
        // Test 1: Create project without profile should fail
        Debug.print("  🧪 should fail to create project without soul profile");
        let noProfileResult = await Manashart.createProject("Test Project", "Description", false);
        switch (noProfileResult) {
            case (#err(error)) {
                if (Text.contains(error, #text "Soul profile not found")) {
                    Debug.print("    ✅ PASS - Correctly rejected project creation without profile");
                } else {
                    Debug.print("    ❌ FAIL - Wrong error message");
                };
            };
            case (#ok(_)) {
                Debug.print("    ❌ FAIL - Should not create project without profile");
            };
        };

        // Test 2: Create project with profile
        Debug.print("  🧪 should create project with valid profile");
        switch (profileResult) {
            case (#ok(_)) {
                let projectResult = await Manashart.createProject(
                    "My Music Album", 
                    "A revolutionary Web3 music album", 
                    true
                );
                switch (projectResult) {
                    case (#ok(project)) {
                        if (project.title == "My Music Album" and 
                            project.description == "A revolutionary Web3 music album" and 
                            project.tokenized == true) {
                            Debug.print("    ✅ PASS - Project created successfully");
                        } else {
                            Debug.print("    ❌ FAIL - Project data mismatch");
                        };
                    };
                    case (#err(error)) {
                        Debug.print("    ❌ FAIL - " # error);
                    };
                };
            };
            case (#err(_)) {
                Debug.print("    ❌ FAIL - Could not create profile for testing");
            };
        };

        // Test 3: Get user projects
        Debug.print("  🧪 should retrieve user projects");
        let projects = await Manashart.getProjects(testPrincipal);
        if (projects.size() >= 1) {
            let project = projects[0];
            if (project.title == "My Music Album") {
                Debug.print("    ✅ PASS - Projects retrieved successfully");
            } else {
                Debug.print("    ❌ FAIL - Project data mismatch in retrieval");
            };
        } else {
            Debug.print("    ❌ FAIL - No projects found");
        };

        // Test 4: Create multiple projects
        Debug.print("  🧪 should create multiple projects");
        let project2Result = await Manashart.createProject(
            "NFT Collection", 
            "Exclusive digital art pieces", 
            false
        );
        switch (project2Result) {
            case (#ok(_)) {
                let allProjects = await Manashart.getProjects(testPrincipal);
                if (allProjects.size() == 2) {
                    Debug.print("    ✅ PASS - Multiple projects created");
                } else {
                    Debug.print("    ❌ FAIL - Expected 2 projects, got " # debug_show(allProjects.size()));
                };
            };
            case (#err(error)) {
                Debug.print("    ❌ FAIL - " # error);
            };
        };

        Debug.print("✅ Test Suite Complete: Project Management\n");
    };
}