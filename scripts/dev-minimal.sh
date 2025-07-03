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
