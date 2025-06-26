# Manashart

A decentralized Web3 platform built on the Internet Computer Protocol (ICP) that creates a conscious digital ecosystem where vibration unlocks new dimensions of interaction and growth.

## 🌟 Features

### Core Modules

- **🏠 Universe** - Central exploration hub with sacred geometry mandala interface
- **✨ Soul** - Personal identity and purpose management with vibration tracking
- **🌊 Flow** - Project management and creation tools
- **🛍️ Store** - Marketplace for art and digital services
- **💰 Wallet** - Multi-token digital wallet with portfolio management
- **📺 Stream** - Audiovisual content streaming platform
- **📈 Invest** - Decentralized investment opportunities
- **📡 Connect** - Internal communication and networking
- **🏛️ DAO** - Collective governance and decision making

### Key Features

- **Vibration-Based Progression** - User's "vibration level" (0-100 Hz) unlocks new modules and features
- **Sacred Geometry Interface** - Interactive mandala visualization for module navigation
- **IC Authentication** - Seamless Internet Computer identity integration
- **Real-time State Management** - Dynamic module unlocking and progress tracking
- **Debug Mode** - Comprehensive development and monitoring tools
- **Mobile Responsive** - Tailored experience across all devices

## 🔧 Tech Stack

- **Backend**: Motoko (Internet Computer canister)
- **Frontend**: React 18 + JSX + Vite
- **Styling**: Tailwind CSS with custom gradients and animations
- **Icons**: Lucide React icon library
- **Routing**: React Router DOM
- **Authentication**: @dfinity/auth-client
- **Testing**: Vitest + Testing Library
- **Blockchain**: Internet Computer Protocol (ICP)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install) (DFINITY Canister SDK)

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd manashart
   npm install
   ```

2. **Start IC Local Network**
   ```bash
   # Start the IC replica in background
   dfx start --background
   ```

3. **Deploy Canisters**
   ```bash
   # Deploy backend and frontend canisters
   dfx deploy
   ```

4. **Start Development Server**
   ```bash
   # Start the frontend development server
   npm start
   ```

Your application will be available at `http://localhost:8080`

### Project Structure

```
manashart/
├── src/
│   ├── manashart_backend/       # Motoko backend canister
│   │   └── main.mo
│   ├── manashart_frontend/      # React frontend
│   │   ├── src/
│   │   │   ├── App.jsx          # Main application wrapper
│   │   │   ├── ManashartApp.jsx # Core application logic
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── modules/         # Feature modules (Soul, Flow, etc.)
│   │   │   ├── services/        # IC integration services
│   │   │   ├── styles/          # Global styles and themes
│   │   │   └── utils/           # Utility functions
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── tailwind.config.js
│   └── declarations/            # Auto-generated IC declarations
├── dfx.json                     # DFX configuration
├── package.json                 # Root package configuration
└── README.md
```

### Available Scripts

```bash
# Frontend development
npm start                # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Backend development
npm run generate        # Generate Candid interface
dfx deploy             # Deploy canisters
dfx start              # Start local IC network

# Testing
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
```

### Environment Configuration

The application automatically detects the network environment:

- **Local Development**: Connects to local IC replica (localhost:4943)
- **IC Mainnet**: Connects to Internet Computer mainnet

For production deployments, ensure `DFX_NETWORK` is set to `ic` to prevent fetching the root key.

### Authentication

The app uses Internet Computer's authentication system:
- **Development**: Test identity with predefined principal
- **Production**: IC Identity integration with Internet Identity

### Debug Mode

Enable debug mode for development insights:
- Click the debug button (🐛) in the bottom right
- View real-time state changes, logs, and connection status
- Monitor authentication flow and canister interactions

## 🎯 Application Architecture

### Vibration System

The core mechanic of Manashart is the **vibration system** - a user progression mechanism:

- Users start with a base vibration level (typically 50-90 Hz)
- Each module has a minimum vibration requirement to unlock
- As users interact and engage, their vibration increases
- Higher vibration unlocks advanced features and modules

### Module System

Manashart is built around 9 core modules, each representing a different aspect of the digital ecosystem:

1. **Universe (0 Hz)** - Always available, central navigation hub
2. **Soul (0 Hz)** - User profile and identity management
3. **Flow (60 Hz)** - Project and task management
4. **Store (70 Hz)** - Digital marketplace
5. **Wallet (65 Hz)** - Cryptocurrency and token management
6. **Stream (75 Hz)** - Media streaming and content
7. **Invest (80 Hz)** - Investment and DeFi features
8. **Connect (85 Hz)** - Social networking and communication
9. **DAO (90 Hz)** - Governance and collective decision making

### IC Integration

- **Canisters**: Smart contracts deployed on the Internet Computer
- **Authentication**: IC Identity for secure, decentralized login
- **State Management**: User profiles and data stored on-chain
- **Frontend Hosting**: Static assets served from IC canisters

## 🧪 Testing

Run the test suite with comprehensive coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files are located alongside their respective components and follow the `*.test.jsx` naming convention.

## 🚢 Deployment

### Local Deployment

```bash
# Deploy to local IC replica
dfx deploy --network local
```

### Mainnet Deployment

```bash
# Deploy to IC mainnet (requires cycles)
dfx deploy --network ic
```

## 🔧 Development

### Adding New Modules

1. Create component in `src/manashart_frontend/src/modules/`
2. Add module configuration to navigation array in `ManashartApp.jsx`
3. Set vibration requirement and styling
4. Implement module-specific logic and UI

### Debug Features

The application includes comprehensive debugging tools:

- **Real-time State Monitoring**: Track authentication, actor status, user profile
- **Activity Logging**: Monitor IC calls and state changes
- **Connection Status**: Visual indicators for IC network connectivity
- **Manual Testing**: Buttons for triggering authentication and state changes

## 📄 License

This project is part of the MANASHART ecosystem - a conscious digital platform for Web3 innovation.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 🔗 Links

- [Internet Computer](https://internetcomputer.org/)
- [DFX SDK Documentation](https://internetcomputer.org/docs/current/developer-docs/setup/)
- [Motoko Programming Language](https://internetcomputer.org/docs/current/motoko/intro/)
- [React Documentation](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**MANASHART** - *Evolving consciousness through decentralized technology* ✨