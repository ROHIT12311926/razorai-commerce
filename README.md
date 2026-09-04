# ⚡ RazorAI Commerce

### 🤖 AI-Powered Autonomous Shopping Agent with Guardrails, Payments & Agent-to-Agent Commerce

RazorAI is an intelligent conversational shopping assistant that lets users **discover products, compare options, manage their cart, and complete purchases using natural language.**

But RazorAI is more than a chatbot.

It combines **AI-powered commerce, autonomous transactions, financial guardrails, human approval, Razorpay payments, intelligent recommendations, auditability, and Agent-to-Agent commerce** into one platform.

> 🤖 AI that can shop.  
> 🛡️ AI that knows its limits.  
> 💰 Every Rupee should be traceable.

---

## 🔗 Project Links

🌐 **Live Store**  
YOUR_FRONTEND_URL

📊 **Merchant Dashboard**  
https://razorai-commerce-dashboard.onrender.com/

🎥 **Demo Video**  
YOUR_VIDEO_URL

💻 **GitHub Repository**  
YOUR_GITHUB_REPO_URL

---

## 🧠 What is RazorAI?

Traditional e-commerce requires users to manually:

**Search → Compare → Add to Cart → Checkout → Pay**

RazorAI turns this into a conversational experience:

**Talk → Discover → Decide → Cart → Guardrail → Payment**

For example:

> **User:** I want a wireless mouse.

RazorAI searches the merchant catalog and recommends suitable products.

> **User:** Add the silent one to my cart.

The agent identifies the correct product and adds it.

> **User:** Checkout.

RazorAI evaluates the transaction against its autonomous spending limit.

If the transaction is within the limit, payment can proceed.

If the transaction exceeds the limit, RazorAI pauses the transaction and requires confirmation / approval.

---

# ✨ Features

## 🏆 Must-Have Features

### 🤖 Conversational AI Shopping

Users can interact with RazorAI naturally instead of manually navigating through multiple pages.

Examples:

- "I want a mouse"
- "Show me gaming keyboards"
- "Which one is better?"
- "Tell me more about this one"
- "Add it to my cart"
- "Remove the mouse"
- "Checkout"
- "Buy it"
- "Proceed"

RazorAI understands conversational references such as:

- this one
- that one
- this
- it
- previous one
- add it
- remove it
- buy it

---

### 🔎 Intelligent Product Discovery

RazorAI connects to the merchant's product catalog through backend tools.

It can:

- Search products
- Search by category
- Retrieve product details
- Check availability
- Validate stock
- Compare products
- Recommend relevant products

The agent only recommends products returned by the available catalog.

---

### 🛒 AI Cart Management

Users can manage their shopping cart using natural language.

Supported actions include:

- Add products
- Remove products
- Specify quantities
- Continue shopping
- Checkout

RazorAI never automatically adds a product without explicit user intent.

---

### 💳 Razorpay Payment Integration

RazorAI integrates with Razorpay for programmatic payment order creation.

Payment flow:

**AI → Backend → Order → Razorpay → Payment**

For transactions within the autonomous limit, RazorAI can create the Razorpay payment order automatically.

---

### 🛡️ Autonomous Transaction Guardrail

RazorAI has an autonomous transaction limit of:

> **₹2,000**

Transactions within the limit can be processed autonomously.

Transactions above the limit require additional confirmation / approval.

### Within ₹2,000

**AI → Validate → Approve → Razorpay Order**

### Above ₹2,000

**AI → Detect Limit → Pause → Human Approval**

This prevents unrestricted autonomous spending.

---

### 👤 Human-in-the-Loop Approval

High-value transactions are escalated instead of being blindly executed.

Example:

> "This transaction exceeds my autonomous spending limit. Human approval is required before proceeding."

This creates a clear boundary between:

**AI Autonomy ↔ Human Authority**

---

### 🔐 Explicit Checkout Confirmation

For transactions requiring confirmation, RazorAI requires explicit user consent.

Examples:

- Yes
- Confirm
- Proceed
- Go ahead
- Buy it
- Purchase it
- Place the order

RazorAI does not treat a vague conversation as financial authorization.

---

### 🔄 Idempotent Checkout

RazorAI protects against accidental duplicate checkout attempts.

If the same checkout request is retried because of:

- Network delays
- API retries
- User clicking again
- Agent retrying an operation

the system is designed to prevent the same transaction intent from unintentionally creating duplicate financial operations.

> **One checkout intent should not accidentally become multiple financial operations.**

---

# 💎 Revenue & Conversion Features

## 💰 Revenue Upselling

After a customer adds a product, RazorAI can suggest complementary products.

Example:

> **Customer:** Adds a gaming mouse.

RazorAI can suggest:

> "You may also like this RGB gaming mousepad."

The recommendations are contextual and based on complementary products.

### Business Impact

This can help increase:

**Average Order Value (AOV)**

while keeping the shopping experience conversational.

---

## 🚚 Dynamic Delivery Nudge

RazorAI can dynamically calculate and communicate how much more the customer needs to spend to unlock a delivery benefit.

Example:

> Cart Total: ₹899  
>
> **"Add ₹601 more to unlock free delivery!"**

Instead of relying only on a static banner, RazorAI communicates the threshold directly through the conversation.

This can encourage customers to add another relevant product.

---

## 📈 Merchant Revenue Tracking

RazorAI tracks commerce activity so the merchant can monitor the financial impact of AI-driven shopping.

The merchant dashboard can surface information such as:

- Total orders
- Revenue
- Order activity
- Transaction amounts
- AI-driven commerce activity

Revenue and order information is reflected in the merchant dashboard.

📊 **Merchant Dashboard:**  
https://razorai-commerce-dashboard.onrender.com/

---

# 🧠 Intelligent Shopping Features

## 📦 Real-Time Stock Validation

Before processing an agent transaction, RazorAI validates:

- Product existence
- Purchase support
- Quantity
- Current stock

If sufficient stock is unavailable, the transaction is safely rejected.

---

## 🧠 Context-Aware Recommendations

RazorAI maintains conversation context.

Example:

> **User:** Show me gaming mice.

> **RazorAI:** Shows multiple gaming mice.

> **User:** Which one is lighter?

> **RazorAI:** Explains the relevant products.

> **User:** Add that one.

The agent understands what **"that one"** refers to from the conversation.

---

## 🔗 Product Catalog

RazorAI maintains a merchant product catalog containing information such as:

- Product name
- Description
- Price
- Category
- Features
- Stock
- Purchase availability

The same commerce catalog can be exposed to AI agents through the agent-facing API.

---

# 🚀 Extra Features

## 🤝 Agent-to-Agent (A2A) Commerce

RazorAI exposes agent-facing commerce capabilities that allow an external AI agent to interact with the merchant's commerce backend.

The agent-facing API provides capabilities such as:

### 📚 Catalog

External agents can retrieve the merchant's purchasable product catalog.

### 🔎 Product Discovery

External agents can discover:

- Products
- Prices
- Stock availability
- Purchase support

### 💳 Agent Transactions

External agents can request purchases through the agent transaction API.

### 🛡️ Same Financial Guardrails

Agent-to-Agent transactions are still protected by the same autonomous transaction limit.

An external AI agent cannot bypass RazorAI's transaction controls.

### A2A Architecture

**External AI Agent**

↓

**RazorAI Agent Commerce API**

↓

**Product Validation**

↓

**Transaction Guardrail**

↓

**Human Approval / Autonomous Processing**

↓

**Razorpay**

This allows RazorAI to function as a **merchant-side commerce agent that other AI agents can interact with.**

---

# 🔐 Security & Financial Auditability

## 💰 Every Rupee Should Be Traceable

RazorAI is designed with financial accountability in mind.

Important AI-driven transaction decisions are recorded through audit logs.

Instead of allowing financial actions to disappear inside a chatbot conversation, RazorAI creates a structured audit trail.

The system can track events such as:

- Autonomous transaction approval
- Transaction rejection
- Human approval escalation
- Transaction amount
- Related order
- Agent/session identity
- Approval status
- Decision type
- Reason for the decision
- Transaction result
- Timestamp

---

## 🧠 Explainable, Bounded, Gated

RazorAI's autonomous commerce system follows three principles:

### 🔍 Explainable

Every important transaction decision can have a reason attached to it.

Example:

```text
Reason:
Amount ₹3698 exceeds autonomous limit of ₹2000
