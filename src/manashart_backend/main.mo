import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Int "mo:base/Int";

actor Manashart {
    // Types
    type UserId = Principal;
    type TokenId = Nat;
    
    // User Soul Profile
    type SoulProfile = {
        id: UserId;
        username: Text;
        vibration: Nat; // 0-100
        avatar: ?Text;
        createdAt: Time.Time;
        modules: [ModuleAccess];
    };

    // Module Access Control
    type ModuleAccess = {
        name: Text;
        enabled: Bool;
        level: Nat;
        unlockedAt: ?Time.Time;
    };

    // Project type for FLOW module
    type Project = {
        id: Text;
        owner: UserId;
        title: Text;
        description: Text;
        tokenized: Bool;
        venue: ?Text;
        services: [Service];
        budget: Nat;
        status: ProjectStatus;
    };

    type ProjectStatus = {
        #Planning;
        #Active;
        #Completed;
        #Cancelled;
    };

    type Service = {
        name: Text;
        provider: ?Text;
        cost: Nat;
        confirmed: Bool;
    };

    // Storage
    private stable var souls : [(UserId, SoulProfile)] = [];
    private var soulProfiles = HashMap.HashMap<UserId, SoulProfile>(0, Principal.equal, Principal.hash);

    private stable var projects : [(Text, Project)] = [];
    private var projectsMap = HashMap.HashMap<Text, Project>(0, Text.equal, Text.hash);

    // Initialize
    system func preupgrade() {
        souls := Iter.toArray(soulProfiles.entries());
        projects := Iter.toArray(projectsMap.entries());
    };

    system func postupgrade() {
        soulProfiles := HashMap.fromIter<UserId, SoulProfile>(souls.vals(), souls.size(), Principal.equal, Principal.hash);
        projectsMap := HashMap.fromIter<Text, Project>(projects.vals(), projects.size(), Text.equal, Text.hash);
    };

    // SOUL Module Functions
    public shared(msg) func createSoulProfile(username: Text) : async Result.Result<SoulProfile, Text> {
        let caller = msg.caller;
        
        switch (soulProfiles.get(caller)) {
            case (?_existing) { #err("Profile already exists") };
            case null {
                let newProfile : SoulProfile = {
                    id = caller;
                    username = username;
                    vibration = 65; // Start with enough vibration to unlock FLOW and WALLET
                    avatar = null;
                    createdAt = Time.now();
                    modules = [
                        { name = "SOUL"; enabled = true; level = 1; unlockedAt = ?Time.now() },
                        { name = "FLOW"; enabled = false; level = 0; unlockedAt = null },
                        { name = "WALLET"; enabled = false; level = 0; unlockedAt = null },
                        { name = "STORE"; enabled = false; level = 0; unlockedAt = null },
                        { name = "STREAM"; enabled = false; level = 0; unlockedAt = null },
                    ];
                };
                soulProfiles.put(caller, newProfile);
                #ok(newProfile)
            };
        }
    };

    public query func getSoulProfile(userId: UserId) : async ?SoulProfile {
        soulProfiles.get(userId)
    };

    // FLOW Module Functions
    public shared(msg) func createProject(
        title: Text, 
        description: Text,
        tokenized: Bool
    ) : async Result.Result<Project, Text> {
        let caller = msg.caller;
        
        // Check if user has FLOW module access
        switch (soulProfiles.get(caller)) {
            case null { return #err("Soul profile not found") };
            case (?profile) {
                let flowModule = Array.find<ModuleAccess>(
                    profile.modules,
                    func(m) = m.name == "FLOW"
                );

                switch (flowModule) {
                    case null { return #err("FLOW module not found in profile") };
                    case (?flowMod) {
                        if (not flowMod.enabled) { return #err("FLOW module is not enabled") };

                        let projectId = Principal.toText(caller) # "_" # Int.toText(Time.now());
                        let newProject : Project = {
                            id = projectId;
                            owner = caller;
                            title = title;
                            description = description;
                            tokenized = tokenized;
                            venue = null;
                            services = [];
                            budget = 0;
                            status = #Planning;
                        };
                        projectsMap.put(projectId, newProject);
                        return #ok(newProject)
                    };
                };
            };
        }
    };

    public query func getProjects(owner: UserId) : async [Project] {
        let userProjects = Array.filter<Project>(
            Iter.toArray(projectsMap.vals()),
            func(p) = p.owner == owner
        );
        userProjects
    };

    // Module Unlock System
    public shared(msg) func unlockModule(moduleName: Text) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        switch (soulProfiles.get(caller)) {
            case null { #err("Soul profile not found") };
            case (?profile) {
                // Check vibration level requirements
                let requiredVibration = switch (moduleName) {
                    case "FLOW" { 60 };
                    case "WALLET" { 65 };
                    case "STORE" { 70 };
                    case "STREAM" { 75 };
                    case _ { 100 };
                };

                if (profile.vibration >= requiredVibration) {
                    // Update module access
                    let updatedModules = Array.map<ModuleAccess, ModuleAccess>(
                        profile.modules,
                        func(m) = if (m.name == moduleName) {
                            { name = m.name; enabled = true; level = 1; unlockedAt = ?Time.now() }
                        } else { m }
                    );

                    let updatedProfile = {
                        id = profile.id;
                        username = profile.username;
                        vibration = profile.vibration;
                        avatar = profile.avatar;
                        createdAt = profile.createdAt;
                        modules = updatedModules;
                    };

                    soulProfiles.put(caller, updatedProfile);
                    #ok("Module " # moduleName # " unlocked!")
                } else {
                    #err("Insufficient vibration level. Required: " # Nat.toText(requiredVibration))
                }
            };
        }
    };

    // Update vibration level (for testing)
    private func updateVibration(caller: Principal, newVibration: Nat) : async Result.Result<Text, Text> {
        switch (soulProfiles.get(caller)) {
            case null { #err("Soul profile not found") };
            case (?profile) {
                let vibrationLevel = if (newVibration > 100) 100 else newVibration;
                let updatedProfile = {
                    id = profile.id;
                    username = profile.username;
                    vibration = vibrationLevel;
                    createdAt = profile.createdAt;
                    modules = profile.modules;
                    avatar = profile.avatar;
                };
                
                soulProfiles.put(caller, updatedProfile);
                #ok("Vibration updated to " # Nat.toText(vibrationLevel) # " Hz")
            };
        }
    };
}
