import Debug "mo:base/Debug";
import SoulProfileTest "./soul_profile_test";
import ProjectManagementTest "./project_management_test";
import ModuleSystemTest "./module_system_test";

actor TestRunner {
    
    public func runAllTests() : async () {
        Debug.print("🚀 MANASHART BACKEND TEST SUITE");
        Debug.print("================================\n");
        
        // Run all test suites
        await SoulProfileTest.runTests();
        await ProjectManagementTest.runTests();
        await ModuleSystemTest.runTests();
        
        Debug.print("🏁 ALL TESTS COMPLETE");
        Debug.print("======================");
    };
    
    public func runSoulProfileTests() : async () {
        await SoulProfileTest.runTests();
    };
    
    public func runProjectManagementTests() : async () {
        await ProjectManagementTest.runTests();
    };
    
    public func runModuleSystemTests() : async () {
        await ModuleSystemTest.runTests();
    };
}