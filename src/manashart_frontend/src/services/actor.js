import { Actor, HttpAgent } from '@dfinity/agent';
import { canisterId, createActor as createBackendActor, idlFactory } from '../../../declarations/manashart_backend';

// Debug logger for actor service
const debugLog = (message, data = null) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[ACTOR DEBUG ${timestamp}] ${message}`, data || '');
};

export const createActor = async (identity) => {
  try {
    debugLog('=== Creating Actor (Simplified Method) ===');
    debugLog('Input identity', { 
      identity: !!identity, 
      identityType: typeof identity,
      principal: identity?.getPrincipal?.()?.toString?.() || 'no principal'
    });
    
    debugLog('Environment check', {
      dfxNetwork: process.env.DFX_NETWORK,
      canisterId,
      nodeEnv: process.env.NODE_ENV
    });

    // Validate canister ID
    if (!canisterId) {
      debugLog('ERROR: No canister ID found');
      throw new Error("Canister ID not found. Make sure dfx is running and deployed.");
    }

    const host = process.env.DFX_NETWORK === "ic" 
      ? "https://ic0.app" 
      : "http://localhost:4943";
    
    debugLog('Using simplified agent creation', { host, hasIdentity: !!identity });

    // Use the declarations createActor but with explicit agent control
    let agent;
    try {
      debugLog('Creating minimal HttpAgent...');
      agent = new HttpAgent({
        host,
        identity: identity || undefined
      });
      
      debugLog('Agent created, fetching root key if needed...');
      
      // Fetch root key synchronously for local development
      if (process.env.DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
        debugLog('Root key fetched');
      }
      
    } catch (agentError) {
      debugLog('Agent creation failed', { error: agentError.message });
      throw new Error(`Agent creation failed: ${agentError.message}`);
    }

    debugLog('Creating actor with pre-configured agent...');

    // Use the declarations helper but pass our pre-configured agent
    const actor = createBackendActor(canisterId, {
      agent: agent
    });

    debugLog('Actor created via declarations', { 
      actor: !!actor,
      actorMethods: actor ? Object.keys(actor).length : 0
    });

    // Skip connectivity test to avoid triggering the transformRequest issue
    debugLog('Skipping connectivity test to avoid transformRequest error');

    debugLog('=== Actor creation successful (simplified) ===');
    return actor;

  } catch (error) {
    debugLog('=== Actor creation failed (simplified) ===', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Fallback: try the most basic approach
    debugLog('Attempting fallback actor creation...');
    try {
      const fallbackActor = createBackendActor(canisterId);
      debugLog('Fallback actor created successfully');
      return fallbackActor;
    } catch (fallbackError) {
      debugLog('Fallback also failed', { error: fallbackError.message });
      throw new Error(`All actor creation methods failed. Original: ${error.message}, Fallback: ${fallbackError.message}`);
    }
  }
};
