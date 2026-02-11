// Content script injected into shef.com pages
// Listens for messages from the popup to scrape the cart

interface CartItem {
  name: string;
  description: string;
}

chrome.runtime.onMessage.addListener(
  (
    request: { type: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: { items: string[] }) => void
  ) => {
    if (request.type === "GET_CART_ITEMS") {
      const items = scrapeCart();
      sendResponse({ items });
    }
    return true;
  }
);

function scrapeCart(): string[] {
  const results: string[] = [];

  // ============================================
  // STRATEGY 1: Read from the order cart sidebar
  // The cart lives in div[data-cy="order-cart"]
  // ============================================
  const orderCart = document.querySelector('[data-cy="order-cart"]');

  if (orderCart) {
    // Dish names are in <button> elements inside the cart
    // They appear as clickable dish name buttons
    // Nearby are price <p> tags with "$XX.XX"
    // We need to filter out non-dish buttons like "View Cart", quantity buttons, etc.

    const buttons = orderCart.querySelectorAll("button");
    const cartDishNames: string[] = [];

    buttons.forEach((btn) => {
      const text = btn.textContent?.trim() || "";

      // Skip UI buttons and non-dish content
      if (text.length < 4) return;
      if (/^[\+\-\d\$\.\s]+$/.test(text)) return; // quantity/price buttons
      if (/^view\s/i.test(text)) return; // "View Cart"
      if (/review|order|remove|checkout|sign|log|apply|promo|cart\d/i.test(text)) return;
      if (/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/i.test(text)) return; // date buttons

      cartDishNames.push(text);
    });

    // Now try to find descriptions for each cart dish
    // Descriptions might be on the menu page in foodItem divs
    cartDishNames.forEach((dishName) => {
      const description = findDishDescription(dishName);
      if (description) {
        results.push(`${dishName} — ${description}`);
      } else {
        results.push(dishName);
      }
    });
  }

  // ============================================
  // STRATEGY 2: Fallback — look near review-order-button
  // ============================================
  if (results.length === 0) {
    const reviewBtn = document.querySelector('[data-cy="review-order-button"]');
    if (reviewBtn) {
      // Walk up to find the cart container
      let container = reviewBtn.parentElement;
      for (let i = 0; i < 5 && container; i++) {
        const buttons = container.querySelectorAll("button");
        const found: string[] = [];

        buttons.forEach((btn) => {
          const text = btn.textContent?.trim() || "";
          if (
            text.length > 4 &&
            !/^[\+\-\d\$\.\s]+$/.test(text) &&
            !/view|review|order|remove|checkout|sign|cart\d/i.test(text) &&
            !/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/i.test(text)
          ) {
            found.push(text);
          }
        });

        if (found.length > 0) {
          found.forEach((name) => {
            const desc = findDishDescription(name);
            results.push(desc ? `${name} — ${desc}` : name);
          });
          break;
        }
        container = container.parentElement;
      }
    }
  }

  // ============================================
  // STRATEGY 3: Broad fallback — scrape visible dish cards from menu
  // If cart detection fails, grab dishes that have quantity > 0
  // (indicated by the decrement button being visible/active)
  // ============================================
  if (results.length === 0) {
    const foodItems = document.querySelectorAll('[data-cy^="foodItem-"]');
    foodItems.forEach((item) => {
      // Check if this item has been added to cart (has active decrement button)
      const decBtn = item.querySelector('[data-cy="quick-add-dec-btn"]');
      if (decBtn) {
        const dishCard = item.querySelector('[data-cy="dish-card"]');
        if (dishCard) {
          const text = dishCard.textContent?.trim() || "";
          // The dish card text contains cuisine tags + dish name + description
          // Try to extract just the name and description
          const extracted = extractDishInfo(text);
          if (extracted) {
            results.push(extracted);
          }
        }
      }
    });
  }

  return [...new Set(results)];
}

/**
 * Try to find a dish description from the menu page's food item cards
 */
function findDishDescription(dishName: string): string | null {
  const foodItems = document.querySelectorAll('[data-cy^="foodItem-"]');
  const lowerName = dishName.toLowerCase();

  for (const item of foodItems) {
    const text = item.textContent || "";
    if (text.toLowerCase().includes(lowerName)) {
      // Found the matching food item card
      // Try to extract description text
      // The card typically has: cuisine tags, dish name, description, servings, price
      const allText = item.querySelectorAll("p, span, div");
      let description = "";

      for (const el of allText) {
        const t = el.textContent?.trim() || "";
        // Skip very short text, prices, servings info, cuisine tags
        if (t.length < 15) continue;
        if (/^\$/.test(t)) continue;
        if (/serving/i.test(t)) continue;
        if (t.toLowerCase() === lowerName) continue;
        // Likely a description if it's a decent length sentence
        if (t.length > 20 && t.length < 300 && !t.includes("·")) {
          description = t;
          break;
        }
      }

      return description || null;
    }
  }

  return null;
}

/**
 * Extract dish name and info from a food item card's full text
 */
function extractDishInfo(fullText: string): string | null {
  // Remove common prefixes like cuisine tags (e.g., "American · Southern · Clean ·")
  const withoutTags = fullText.replace(/^([A-Za-z\s]+·\s*)+/, "").trim();
  // Take the first meaningful chunk (up to about 150 chars)
  const trimmed = withoutTags.substring(0, 150).trim();
  return trimmed.length > 3 ? trimmed : null;
}