/**
 * Node.js proxy bootstrap script for Sherlock.
 * This script is loaded via NODE_OPTIONS="--require" to intercept fetch() calls.
 */

const proxyUrl = process.env.SHERLOCK_PROXY_URL;
const debug = process.env.SHERLOCK_DEBUG === '1';

if (proxyUrl) {
  try {
    // Try to load undici and set up proxy
    const { ProxyAgent, setGlobalDispatcher } = require('undici');
    const agent = new ProxyAgent(proxyUrl);
    setGlobalDispatcher(agent);
    if (debug) console.error('[Sherlock] Proxy configured via undici');
  } catch (e) {
    // undici not available, try global-agent for http/https modules
    try {
      require('global-agent/bootstrap');
      if (debug) console.error('[Sherlock] Proxy configured via global-agent');
    } catch (e2) {
      // Neither available, proxy won't work for this app
      console.error('[Sherlock] Warning: Could not set up proxy. Run: npm install -g undici');
    }
  }
}
