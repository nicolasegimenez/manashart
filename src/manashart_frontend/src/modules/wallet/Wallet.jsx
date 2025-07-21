import React, { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  ExternalLink,
  Settings,
  Zap,
  Bitcoin,
  Gem,
  DollarSign,
  RefreshCw,
  Shield,
  Link
} from 'lucide-react';

const Wallet = ({ actor, userProfile, refreshProfile }) => {
  const [activeTab, setActiveTab] = useState('balance');
  const [walletData, setWalletData] = useState({
    balances: {
      icp: 12.5,
      btc: 0.00234,
      eth: 0.145,
      ckbtc: 0.00234,
      cketh: 0.145
    },
    transactions: [
      { id: 1, type: 'receive', amount: 5.0, token: 'ICP', from: 'rrkah-...', timestamp: '2024-01-15T10:30:00Z', status: 'completed' },
      { id: 2, type: 'send', amount: 0.001, token: 'BTC', to: 'bc1qxy2k...', timestamp: '2024-01-14T15:45:00Z', status: 'completed' },
      { id: 3, type: 'chainfusion', amount: 0.145, token: 'ckETH', timestamp: '2024-01-13T09:15:00Z', status: 'completed' }
    ],
    chainFusionConnections: {
      bitcoin: { connected: true, lastSync: '2024-01-15T10:30:00Z' },
      ethereum: { connected: true, lastSync: '2024-01-15T10:25:00Z' }
    }
  });

  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showChainFusionModal, setShowChainFusionModal] = useState(false);

  const TokenIcon = ({ token }) => {
    switch (token.toLowerCase()) {
      case 'icp':
        return <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">IC</div>;
      case 'btc':
      case 'ckbtc':
        return <Bitcoin className="w-8 h-8 text-orange-500" />;
      case 'eth':
      case 'cketh':
        return <Gem className="w-8 h-8 text-blue-500" />;
      default:
        return <DollarSign className="w-8 h-8 text-gray-500" />;
    }
  };

  const formatAmount = (amount, token) => {
    if (token === 'BTC' || token === 'ckBTC') {
      return amount.toFixed(8);
    } else if (token === 'ETH' || token === 'ckETH') {
      return amount.toFixed(6);
    }
    return amount.toFixed(2);
  };

  const getTokenName = (token) => {
    switch (token.toLowerCase()) {
      case 'ckbtc': return 'Chain-key Bitcoin';
      case 'cketh': return 'Chain-key Ethereum';
      case 'btc': return 'Bitcoin';
      case 'eth': return 'Ethereum';
      case 'icp': return 'Internet Computer';
      default: return token;
    }
  };

  const BalanceCard = ({ token, amount, isChainKey = false }) => (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TokenIcon token={token} />
          <div>
            <h3 className="text-white font-semibold">{token.toUpperCase()}</h3>
            <p className="text-white/60 text-sm">{getTokenName(token)}</p>
          </div>
        </div>
        {isChainKey && (
          <div className="flex items-center gap-1 text-purple-400 text-xs">
            <Link className="w-3 h-3" />
            <span>ChainFusion</span>
          </div>
        )}
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-white">{formatAmount(amount, token)}</p>
        <p className="text-white/60 text-sm">${(amount * 42000).toFixed(2)} USD</p>
      </div>
    </div>
  );

  const TransactionItem = ({ transaction }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${
          transaction.type === 'receive' ? 'bg-green-500/20 text-green-400' :
          transaction.type === 'send' ? 'bg-red-500/20 text-red-400' :
          'bg-purple-500/20 text-purple-400'
        }`}>
          {transaction.type === 'receive' ? <ArrowDownLeft className="w-4 h-4" /> :
           transaction.type === 'send' ? <ArrowUpRight className="w-4 h-4" /> :
           <Link className="w-4 h-4" />}
        </div>
        <div>
          <p className="text-white font-medium">
            {transaction.type === 'receive' ? 'Received' :
             transaction.type === 'send' ? 'Sent' :
             'ChainFusion Bridge'}
          </p>
          <p className="text-white/60 text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white font-semibold">
          {transaction.type === 'receive' ? '+' : '-'}{formatAmount(transaction.amount, transaction.token)} {transaction.token}
        </p>
        <p className="text-white/60 text-sm capitalize">{transaction.status}</p>
      </div>
    </div>
  );

  const SendModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Send Tokens</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Token</label>
            <select className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white">
              <option>ICP</option>
              <option>ckBTC</option>
              <option>ckETH</option>
            </select>
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Recipient Address</label>
            <input 
              type="text" 
              placeholder="Enter wallet address or principal"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Amount</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setShowSendModal(false)}
              className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ReceiveModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Receive Tokens</h3>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Your ICP Address</span>
              <button className="text-purple-400 hover:text-purple-300">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white font-mono text-sm break-all">
              rrkah-fqaaa-aaaah-qcyka-cai
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Bitcoin Address (via ChainFusion)</span>
              <button className="text-purple-400 hover:text-purple-300">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white font-mono text-sm break-all">
              bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Ethereum Address (via ChainFusion)</span>
              <button className="text-purple-400 hover:text-purple-300">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white font-mono text-sm break-all">
              0x742d35Cc6634C0532925a3b8D16C7C36B5d34
            </p>
          </div>
          <button 
            onClick={() => setShowReceiveModal(false)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity mt-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const ChainFusionModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">ChainFusion Bridge</h3>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Link className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Cross-chain Bridge</span>
            </div>
            <p className="text-white/70 text-sm">
              Convert between native tokens (BTC, ETH) and their chain-key equivalents (ckBTC, ckETH) seamlessly.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <Bitcoin className="w-6 h-6 text-orange-500" />
                <span className="text-white">Bitcoin Network</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <Gem className="w-6 h-6 text-blue-500" />
                <span className="text-white">Ethereum Network</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Connected</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
            <p className="text-yellow-300 text-sm">
              <strong>Coming Soon:</strong> Bridge your Bitcoin and Ethereum directly to the Internet Computer using ChainFusion technology.
            </p>
          </div>
          
          <button 
            onClick={() => setShowChainFusionModal(false)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity mt-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <WalletIcon className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Wallet</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowChainFusionModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Link className="w-4 h-4" />
            ChainFusion
          </button>
          <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        {['balance', 'transactions', 'bridge'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Balance Tab */}
      {activeTab === 'balance' && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={() => setShowSendModal(true)}
              className="flex-1 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-5 h-5" />
              Send
            </button>
            <button 
              onClick={() => setShowReceiveModal(true)}
              className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <ArrowDownLeft className="w-5 h-5" />
              Receive
            </button>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BalanceCard token="icp" amount={walletData.balances.icp} />
            <BalanceCard token="ckbtc" amount={walletData.balances.ckbtc} isChainKey={true} />
            <BalanceCard token="cketh" amount={walletData.balances.cketh} isChainKey={true} />
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
            <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            {walletData.transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      )}

      {/* Bridge Tab */}
      {activeTab === 'bridge' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Link className="w-8 h-8 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">ChainFusion Bridge</h2>
            </div>
            <p className="text-white/70 mb-6">
              Bridge your Bitcoin and Ethereum tokens to the Internet Computer using ChainFusion technology. 
              Enjoy native multi-chain functionality with decentralized security.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <Bitcoin className="w-6 h-6 text-orange-500" />
                  <div>
                    <h3 className="text-white font-semibold">Bitcoin Bridge</h3>
                    <p className="text-white/60 text-sm">BTC ↔ ckBTC</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Connected</span>
                </div>
                <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Bridge Bitcoin
                </button>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <Gem className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="text-white font-semibold">Ethereum Bridge</h3>
                    <p className="text-white/60 text-sm">ETH ↔ ckETH</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Connected</span>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Bridge Ethereum
                </button>
              </div>
            </div>
          </div>

          {/* Bridge Tutorial */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">How ChainFusion Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Secure</h4>
                <p className="text-white/70 text-sm">No trusted bridges or wrapped tokens. Direct integration with Bitcoin and Ethereum networks.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Fast</h4>
                <p className="text-white/70 text-sm">Near-instant bridging with minimal fees. No waiting for multiple confirmations.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Link className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Native</h4>
                <p className="text-white/70 text-sm">True multi-chain functionality without leaving the Internet Computer ecosystem.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showSendModal && <SendModal />}
      {showReceiveModal && <ReceiveModal />}
      {showChainFusionModal && <ChainFusionModal />}
    </div>
  );
};

export default Wallet;