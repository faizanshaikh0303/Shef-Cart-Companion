# Privacy Policy — Shef Cart Companion

**Last updated: February 2026**

## What data does this extension collect?

Shef Cart Companion reads **dish names only** from your Shef.com shopping cart when you click the extension icon. No other data from any webpage is collected.

## How is this data used?

Dish names are sent to our backend server, which forwards them to the Groq AI API to generate taste profiles, fun facts, and pairing recommendations. The AI responses are cached locally in your browser so the same dish does not need to be re-analyzed.

## What data is stored?

- **Locally in your browser**: Cached AI responses (dish name + insight text) and a daily API call counter. This data is stored using Chrome's storage API and is cleared when you close your browser session or clear extension data.
- **On our servers**: We do not store any user data on our servers. Requests are proxied to the Groq API and responses are returned directly to your browser.

## Third-party services

- **Groq API** (api.groq.com): Receives dish names to generate AI insights. Groq's privacy policy: https://groq.com/privacy-policy/

## Data sharing

We do not sell, trade, or share any user data with third parties. Dish names are only shared with the Groq API for the sole purpose of generating food insights.

## Contact

If you have questions about this privacy policy, open an issue at:
https://github.comfaizanshaikh0303/shef-cart-companion/issues