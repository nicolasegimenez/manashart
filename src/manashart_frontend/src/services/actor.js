import { Actor, HttpAgent } from "@dfinity/agent";
import {
  canisterId,
  createActor as createBackendActor,
} from "../../../declarations/manashart_backend";

const debugLog = (message, data = null) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[ACTOR DEBUG ${timestamp}] ${message}`, data || "");
};

export const createActor = async (identity) => {
  try {
    debugLog("=== Creating Actor (v2 API) ===");
    debugLog("Input identity", {
      identity: !!identity,
      identityType: typeof identity,
      principal: identity?.getPrincipal?.()?.toString?.() || "no principal",
    });

    const host =
      process.env.DFX_NETWORK === "ic"
        ? "https://ic0.app"
        : "http://localhost:4943";
    debugLog("Agent configuration", { host });

    const agent = new HttpAgent({
      identity,
      host,
    });

    if (process.env.DFX_NETWORK !== "ic") {
      debugLog("Fetching root key for local development...");
      await agent.fetchRootKey();
      debugLog("Root key fetched successfully.");
    }

    debugLog("Creating actor with configured agent...");
    const actor = createBackendActor(canisterId, {
      agent,
    });

    debugLog("Actor created successfully", {
      actor: !!actor,
      actorMethods: actor ? Object.keys(actor).length : 0,
    });

    debugLog("=== Actor creation successful (v2 API) ===");
    return actor;
  } catch (error) {
    debugLog("=== Actor creation failed (v2 API) ===", {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    throw new Error(`Actor creation failed: ${error.message}`);
  }
};