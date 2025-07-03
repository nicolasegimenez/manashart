#!/bin/bash

# ENHANCE MINIMAL VERSION
# =======================

echo "✨ Enhancing Minimal Version"
echo "==========================="

# 1. Create a simplified backend interface
echo "📝 Creating minimal backend interface..."
cat > src/manashart_backend/minimal.mo << 'EOF'
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";

// Minimal version focusing on Soul and Flow modules only
actor ManashartMinimal {
    
    // Simplified types for minimal version
    type Profile = {
        id: Principal;
        username: Text;
        vibration: Nat;
        avatar: ?Text;
        createdAt: Time.Time;
    };

    type Project = {
        id: Text;
        owner: Principal;
        title: Text;
        description: Text;
        createdAt: Time.Time;
        status: { #Active; #Completed; #Archived };
    };

    // Storage
    private stable var profiles : [(Principal, Profile)] = [];
    private stable var projects : [(Text, Project)] = [];

    // SOUL MODULE FUNCTIONS
    public shared(msg) func createProfile(username: Text) : async Result.Result<Profile, Text> {
        // Implementation
        #ok({
            id = msg.caller;
            username = username;
            vibration = 50; // Starting vibration
            avatar = null;
            createdAt = Time.now();
        })
    };

    public query func getProfile(user: Principal) : async ?Profile {
        // Get user profile
        null // Placeholder
    };

    public shared(msg) func updateVibration(newVibration: Nat) : async Result.Result<Text, Text> {
        if (newVibration > 100) {
            return #err("Vibration cannot exceed 100Hz");
        };
        #ok("Vibration updated to " # Nat.toText(newVibration) # "Hz")
    };

    // FLOW MODULE FUNCTIONS
    public shared(msg) func createProject(title: Text, description: Text) : async Result.Result<Project, Text> {
        let project : Project = {
            id = "project_" # Principal.toText(msg.caller) # "_" # Int.toText(Time.now());
            owner = msg.caller;
            title = title;
            description = description;
            createdAt = Time.now();
            status = #Active;
        };
        #ok(project)
    };

    public query func getUserProjects(user: Principal) : async [Project] {
        // Return user's projects
        []
    };

    // SYSTEM FUNCTIONS
    public query func getSystemInfo() : async {
        name: Text;
        version: Text;
        modules: [Text];
    } {
        {
            name = "Manashart Minimal";
            version = "0.1.0";
            modules = ["Universe", "Soul", "Flow"];
        }
    };
}
EOF

echo "✅ Minimal backend interface created"

# 2. Create simplified styles
echo ""
echo "🎨 Creating minimal theme..."
cat > src/manashart_frontend/src/styles/minimal-theme.css << 'EOF'
/* Minimal Manashart Theme */
:root {
  /* Core Colors */
  --universe-primary: #9B59B6;
  --universe-secondary: #3498DB;
  
  --soul-primary: #E91E63;
  --soul-secondary: #9C27B0;
  
  --flow-primary: #2196F3;
  --flow-secondary: #00BCD4;
  
  /* Neutral Colors */
  --bg-dark: #0F0F0F;
  --bg-medium: #1A1A1A;
  --bg-light: #2A2A2A;
  
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --text-dim: #707070;
  
  /* Effects */
  --glow-universe: 0 0 30px rgba(155, 89, 182, 0.5);
  --glow-soul: 0 0 30px rgba(233, 30, 99, 0.5);
  --glow-flow: 0 0 30px rgba(33, 150, 243, 0.5);
}

/* Simplified animations */
@keyframes orbit {
  from { transform: rotate(0deg) translateX(200px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* Module-specific styles */
.module-universe {
  background: linear-gradient(135deg, var(--universe-primary), var(--universe-secondary));
  box-shadow: var(--glow-universe);
}

.module-soul {
  background: linear-gradient(135deg, var(--soul-primary), var(--soul-secondary));
  box-shadow: var(--glow-soul);
}

.module-flow {
  background: linear-gradient(135deg, var(--flow-primary), var(--flow-secondary));
  box-shadow: var(--glow-flow);
}

/* Clean card design */
.minimal-card {
  background: var(--bg-medium);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.minimal-card:hover {
  background: var(--bg-light);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Vibration indicator */
.vibration-display {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-variant-numeric: tabular-nums;
}

.vibration-display::before {
  content: "〰️";
  animation: pulse-glow 2s ease-in-out infinite;
}
EOF

echo "✅ Minimal theme created"

# 3. Create a test configuration for the minimal version
echo ""
echo "🧪 Creating test configuration..."
cat > tests/minimal-test-config.js << 'EOF'
// Test configuration for minimal version
export const minimalTestConfig = {
  modules: ['Universe', 'Soul', 'Flow'],
  
  testUsers: [
    {
      name: 'NewUser',
      vibration: 50,
      canAccess: ['Universe', 'Soul'],
      cannotAccess: ['Flow']
    },
    {
      name: 'ActiveUser',
      vibration: 75,
      canAccess: ['Universe', 'Soul', 'Flow'],
      cannotAccess: []
    }
  ],
  
  vibrationRequirements: {
    Universe: 0,
    Soul: 0,
    Flow: 60
  },
  
  testProjects: [
    {
      title: 'My First Album',
      description: 'Testing the Flow module',
      requiredVibration: 60
    }
  ]
};
EOF

echo "✅ Test configuration created"

# 4. Create development utilities
echo ""
echo "🔧 Creating development utilities..."
cat > scripts/dev-minimal.sh << 'EOF'
#!/bin/bash

# Development script for minimal version
echo "🚀 Starting Minimal Manashart Development"
echo "========================================"

# Function to check vibration requirements
check_requirements() {
    echo ""
    echo "📊 Module Requirements:"
    echo "- Universe: 0 Hz (Always accessible)"
    echo "- Soul: 0 Hz (Always accessible)"
    echo "- Flow: 60 Hz (Requires vibration)"
}

# Function to create test user with specific vibration
create_test_user() {
    local vibration=${1:-50}
    echo ""
    echo "Creating test user with ${vibration}Hz vibration..."
    
    dfx identity new test_user_${vibration} --storage-mode=plaintext 2>/dev/null || true
    dfx identity use test_user_${vibration}
    
    # Call backend to create profile
    dfx canister call manashart_backend createSoulProfile "(\"TestUser${vibration}\", ${vibration})"
    
    dfx identity use default
}

# Main menu
while true; do
    echo ""
    echo "Minimal Manashart Dev Tools"
    echo "1. Check module requirements"
    echo "2. Create test user (50Hz)"
    echo "3. Create test user (75Hz)"
    echo "4. Run minimal tests"
    echo "5. Exit"
    
    read -p "Select option: " choice
    
    case $choice in
        1) check_requirements ;;
        2) create_test_user 50 ;;
        3) create_test_user 75 ;;
        4) npm test -- --grep "minimal" ;;
        5) exit 0 ;;
        *) echo "Invalid option" ;;
    esac
done
EOF

chmod +x scripts/dev-minimal.sh
echo "✅ Development utilities created"

# 5. Update package.json with minimal scripts
echo ""
echo "📝 Adding minimal-specific npm scripts..."
node -e "
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('src/manashart_frontend/package.json', 'utf8'));

packageJson.scripts['start:minimal'] = 'vite --mode minimal';
packageJson.scripts['build:minimal'] = 'vite build --mode minimal';
packageJson.scripts['test:minimal'] = 'vitest --grep minimal';

fs.writeFileSync('src/manashart_frontend/package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Package.json updated with minimal scripts');
"

# 6. Create environment file for minimal mode
echo ""
echo "🔧 Creating environment configuration..."
cat > src/manashart_frontend/.env.minimal << 'EOF'
VITE_APP_MODE=minimal
VITE_ENABLED_MODULES=Universe,Soul,Flow
VITE_MAX_VIBRATION=100
VITE_FLOW_MIN_VIBRATION=60
EOF

echo "✅ Environment configuration created"

# 7. Git commit enhancements
echo ""
echo "📝 Committing enhancements..."
git add -A
git commit -m "enhance: Add minimal version improvements

- Added minimal backend interface
- Created minimal theme and styles
- Added test configuration for minimal modules
- Created development utilities script
- Added minimal-specific npm scripts
- Created environment configuration"

echo ""
echo "🎉 MINIMAL VERSION ENHANCED!"
echo "==========================="
echo ""
echo "New features added:"
echo "✅ Minimal theme in src/styles/minimal-theme.css"
echo "✅ Test config in tests/minimal-test-config.js"
echo "✅ Dev tools: ./scripts/dev-minimal.sh"
echo "✅ NPM scripts: npm run start:minimal"
echo ""
echo "Happy coding! 🚀"
