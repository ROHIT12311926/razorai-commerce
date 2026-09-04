<div align="center">

# 🤖 RazorAI Commerce

### **The AI-native way to shop.**

A conversational AI shopping agent that helps users **discover products, compare options, manage carts, receive intelligent recommendations, and initiate secure payments** — all through natural language.

Built for the **Razorpay AI Buildathon** 🚀

<p>
  <a href="https://razorai-commerce-frontend.onrender.com">
    <img src="https://img.shields.io/badge/🚀%20Live%20Demo-RazorAI-0A0A0A?style=for-the-badge" />
  </a>
  <a href="YOUR_GITHUB_REPO_LINK">
    <img src="https://img.shields.io/badge/💻%20GitHub-Repository-0A0A0A?style=for-the-badge" />
  </a>
  <a href="YOUR_VIDEO_LINK">
    <img src="https://img.shields.io/badge/🎥%20Demo%20Video-Watch%20Demo-0A0A0A?style=for-the-badge" />
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini%20AI-8E75B2?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-3395FF?style=flat-square&logo=razorpay&logoColor=white" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black" />
</p>

</div>

---

## 🧠 What is RazorAI?

Traditional e-commerce makes users search through products, open product pages, compare options, add items to carts, and finally proceed to checkout.

**RazorAI changes that interaction.**

Instead of navigating through the store manually, users can simply talk to an AI shopping agent.

```text
"I need a wireless mouse under ₹1500"
```

RazorAI can understand the request, search the merchant's catalog, recommend suitable products, add the selected product to the cart, and help the user proceed toward checkout.

The key idea is that **AI does not get unrestricted control over financial transactions.**

```text
User
  ↓
RazorAI
  ↓
Product Discovery
  ↓
Recommendation
  ↓
Cart Management
  ↓
Transaction Guardrails
  ↓
Razorpay
  ↓
Order
  ↓
Merchant Dashboard
```

> **AI can request a transaction. The backend decides whether that transaction is allowed.**

---

## 🔗 Quick Access

|    | Resource                                                                 |
| -- | ------------------------------------------------------------------------ |
| 🚀 | **Live Store** — https://razorai-commerce-frontend.onrender.com          |
| 📊 | **Merchant Dashboard** — https://razorai-commerce-dashboard.onrender.com |
| ⚙️ | **Agent Backend** — https://razorai-commerce-backend.onrender.com        |
| 💻 | **GitHub Repository** — `YOUR_GITHUB_REPO_LINK`                          |
| 🎥 | **Demo Video** — `YOUR_VIDEO_LINK`                                       |

---

# ✨ Features

RazorAI's capabilities are organized by their role in the overall platform.

---

# ⭐ Must-Have Features

The core features that power the AI shopping experience.

### 🤖 Conversational Shopping Agent

Users can interact with the store using natural language instead of traditional e-commerce navigation.

```text
"I want a mouse"

"Show me gaming keyboards"

"Which one is better?"

"Add the Silent Wireless Mouse"

"Remove the keyboard"

"Checkout"
```

The AI understands the user's intent and uses the appropriate backend capability.

---

### 🔎 AI Product Discovery

RazorAI searches the actual merchant catalog when users are looking for products.

The agent can understand requests based on:

* Product type
* Category
* Features
* User requirements
* Natural-language descriptions

The AI does **not** invent products, prices, or stock information.

---

### 🛒 Conversational Cart Management

Users can manage their cart directly through conversation.

```text
"Add the Silent Wireless Mouse"

"Add two keyboards"

"Remove the mouse"

"Add this one"
```

Products are only added when the user explicitly requests the action.

---

### 💳 AI-Assisted Checkout

Users can initiate checkout naturally:

```text
"Checkout"

"Buy everything in my cart"

"Place the order"

"Proceed with the purchase"
```

The backend validates the transaction before creating the Razorpay payment order.

---

### 🛡️ ₹2,000 Autonomous Transaction Guardrail

RazorAI has a configured autonomous transaction limit of:

# ₹2,000

Transactions within the limit can proceed through the autonomous flow.

Transactions above the limit require additional approval.

```text
₹899
  ↓
Within ₹2,000 limit
  ↓
Autonomous transaction
```

```text
₹2,299
  ↓
Above ₹2,000 limit
  ↓
Approval required
```

---

### 👤 Human-in-the-Loop Approval

High-value purchases are not blindly processed by the AI.

For example:

```text
K8 Wireless Mechanical Keyboard
₹2,299
        ↓
Autonomous limit exceeded
        ↓
PENDING_APPROVAL
```

This creates a safety boundary between AI decision-making and financial execution.

---

# 💰 Revenue & Upselling Features

RazorAI is designed to help merchants increase cart value while keeping recommendations useful and contextual.

### 🛍️ Smart Product Upselling

After a customer adds a product to the cart, RazorAI can suggest relevant complementary products.

Example:

```text
Customer adds:
🖱️ Silent Wireless Mouse

RazorAI suggests:
🖱️ Gaming Mousepad
⌨️ Wireless Keyboard
```

Recommendations are based on products actually available in the merchant catalog.

---

### 🔄 Context-Aware Cross-Selling

RazorAI can suggest products that naturally complement what the customer is already buying.

Examples:

```text
Mouse
  ↓
Mousepad
```

```text
Keyboard
  ↓
Mouse
```

```text
Monitor
  ↓
Laptop Stand
```

This creates opportunities for merchants to increase the customer's basket size without forcing irrelevant recommendations.

---

### 🚚 Dynamic Free-Delivery Nudges

RazorAI dynamically checks the customer's cart value and tells them exactly how much more they need to spend to unlock free delivery.

Example:

```text
Cart Total: ₹899

🛍️ Add ₹601 more to unlock free delivery!
```

If the cart changes:

```text
Cart Total: ₹1,700

🛍️ Add ₹300 more to unlock free delivery!
```

The nudge changes dynamically according to the cart total and configured threshold.

This gives the customer a clear incentive while creating an opportunity for merchants to increase **Average Order Value (AOV)**.

---

### 📈 AOV Optimization

Combining:

```text
Relevant Upselling
       +
Cross-Selling
       +
Free-Delivery Nudges
       ↓
Higher Basket Value
```

RazorAI turns the AI assistant into more than a support chatbot — it can also become a conversational sales assistant.

---

### 🎯 Context-Aware Recommendations

Recommendations are connected to the customer's current shopping context.

Instead of randomly suggesting products, RazorAI can use:

* Current product
* Cart contents
* Product category
* Available catalog
* User's conversation

to provide more relevant suggestions.

---

# 🚀 Extra Features

Features that extend RazorAI beyond a conventional AI shopping chatbot.

### 🤖 Agent-to-Agent Commerce

RazorAI is designed to be accessible by **other AI agents**, not just human users.

A machine-readable catalog is exposed through:

```http
GET /api/v1/agent/catalog
```

External agents can discover:

```text
Merchant
Products
Prices
Stock
Categories
Features
Purchase Support
Agent Capabilities
Transaction Limits
```

External agents can request transactions through:

```http
POST /api/v1/agent/transact
```

This creates the foundation for:

> **Agent → Merchant → Payment**

commerce.

---

### 🔗 AI-Readable Merchant Catalog

The merchant exposes structured catalog information that external AI agents can understand without scraping the website.

Example:

```json
{
  "agent_purchasable": true,
  "capabilities": {
    "catalog": true,
    "product_search": true,
    "purchase": true,
    "razorpay_payment": true,
    "autonomous_transaction_limit": 2000
  }
}
```

This makes the merchant **AI-readable and AI-purchasable**.

---

### 🔁 Conversational Idempotency

AI agents and users can accidentally repeat checkout requests because of retries, slow responses, or network latency.

RazorAI includes idempotency protection around transaction requests to reduce the risk of duplicate payment-order creation.

```text
Checkout Request
      ↓
Idempotency Check
      ↓
Already Processed?
   ↙          ↘
 YES          NO
 ↓             ↓
Reuse        Process
Existing     Transaction
Result
```

This is especially important when AI is involved in financial workflows.

---

### 🧠 Conversation Memory

RazorAI maintains the ongoing conversation context so users don't have to repeatedly specify product names.

It understands references such as:

```text
this
that
it
this one
that one
the previous one
add it
remove it
buy it
yes
proceed
go ahead
```

Example:

```text
User:
Tell me about the RGB Gaming Mouse.

RazorAI:
...

User:
Add it to my cart.

RazorAI:
Adds the previously discussed mouse.
```

---

# 🔮 Seeing the Future

RazorAI is built around the idea that **AI agents will become a new interface for commerce.**

### Today's Commerce

```text
Human
  ↓
Website
  ↓
Product
  ↓
Checkout
```

### Agentic Commerce

```text
User
  ↓
Personal AI Agent
  ↓
Merchant Discovery
  ↓
Product Selection
  ↓
Transaction Request
  ↓
Merchant Guardrails
  ↓
Payment
```

Imagine telling your AI:

```text
"Find me a good wireless mouse under ₹1500
and purchase it if you find a suitable one."
```

The AI agent could discover compatible merchants, evaluate their catalogs, select a product, and request a transaction.

The merchant backend would still enforce its own rules before allowing the transaction.

### The Bigger Idea

RazorAI is not only an AI shopping assistant.

It is a step toward a world where:

> **Websites are no longer the only interface to commerce. AI agents become the interface.**

---

# 🔐 Security Features

Financial actions require stronger controls than normal conversational responses.

### 🛡️ Backend-Enforced Transaction Control

The AI does not directly decide whether a payment should happen.

```text
AI Intent
   ↓
Backend Validation
   ↓
Guardrails
   ↓
Transaction Decision
   ↓
Razorpay
```

The backend remains the final authority.

---

### 🔁 Idempotency Protection

Repeated transaction requests are protected against unnecessary duplicate processing.

This is especially important for:

* AI retries
* Network delays
* Duplicate user commands
* Repeated checkout requests

---

### 🧾 Audit Logging

Important agent transaction events are recorded for traceability.

Examples:

```text
AGENT_TRANSACTION_APPROVED
AGENT_TRANSACTION_REJECTED
AGENT_TRANSACTION_ESCALATED
```

This provides visibility into important AI-driven commerce decisions.

---

### 🛑 Explicit Purchase Consent

RazorAI separates:

```text
Adding something to the cart
```

from:

```text
Actually purchasing something
```

The AI does not automatically checkout just because an item was added.

Higher-value transactions require explicit confirmation before proceeding.

---

### 📦 Stock Validation

The backend checks product availability before creating a transaction.

The AI cannot override the merchant's actual stock state.

---

# 🏪 Merchant Value

RazorAI gives the merchant a dedicated operational layer instead of making the AI the only interface.

### 📊 Merchant Visibility

The merchant can monitor the commerce activity generated through RazorAI from the dedicated dashboard.

### 📈 Conversion Opportunities

The combination of:

```text
Conversational Discovery
        +
Upselling
        +
Cross-Selling
        +
Free-Delivery Nudges
        +
Low-Friction Checkout
```

creates multiple opportunities to improve the shopping journey and increase order value.

---

### 🤖 New AI Commerce Channel

A2A support allows external AI agents to interact with the merchant's catalog and transaction API.

Instead of relying only on:

```text
Human → Website
```

the merchant can prepare for:

```text
AI Agent → Merchant
```

as another potential commerce channel.

---

### 🛡️ Controlled Automation

Merchants can automate lower-value transactions while maintaining stronger approval requirements for higher-value purchases.

This balances:

**Automation + Conversion + Risk Control**

---

# 📦 Product Catalog

RazorAI uses a structured merchant catalog containing multiple product categories.

### Current Catalog Categories

* ⌨️ Keyboards
* 🖱️ Mice
* 🖱️ Mousepads
* 🖥️ Monitors
* 🎧 Audio
* 🔌 Accessories

Products contain structured information such as:

```text
Product
├── Name
├── Description
├── Price
├── Currency
├── Stock
├── Features
├── Category
└── Purchase Support
```

The same catalog powers both:

**Human-facing AI shopping**

and

**Machine-facing Agent Commerce APIs.**

---

# 📊 Merchant Dashboard

RazorAI includes a dedicated merchant dashboard:

### 📊 https://razorai-commerce-dashboard.onrender.com/

The dashboard provides the merchant with visibility into the commerce activity generated through the platform.

It includes information such as:

* 📦 Orders
* 💰 Revenue
* 📊 Sales activity
* 🛒 Transaction information
* 🤖 Agent-driven commerce activity

### 🔄 Store → Payment → Dashboard

```text
Customer / AI Agent
        ↓
Product Discovery
        ↓
Cart
        ↓
Checkout
        ↓
Razorpay
        ↓
Order
        ↓
Merchant Dashboard
        ↓
Revenue & Order Updates
```

As orders and successful transactions are processed, the corresponding **order and revenue information is reflected in the merchant dashboard**.

This gives the merchant a separate operational view from the customer's shopping experience.

---

# 🎥 Demo Video

See the complete RazorAI experience in action:

### ▶️ Demo Video

**YOUR_VIDEO_LINK**

The demo showcases:

```text
AI Product Discovery
        ↓
Product Selection
        ↓
Cart Management
        ↓
Smart Recommendations
        ↓
Dynamic Free-Delivery Nudge
        ↓
Checkout
        ↓
Transaction Guardrails
        ↓
Razorpay Test Payment
        ↓
Merchant Dashboard
```

---

# 💳 How to Test Razorpay Checkout

RazorAI uses **Razorpay Test Mode** for demonstration purposes.

When the Razorpay test checkout opens, use:

```text
Card Number:
5555 5100 0008 1006

Expiry:
Any future date

OTP:
1234
```

> ⚠️ This is a **test-mode payment flow**. No real money is charged.

If the checkout asks for additional test-card fields such as CVV, use the value accepted by the Razorpay test environment.

---

# 🧪 Try These Prompts

Open the live store and try the following.

### 🔎 Product Discovery

```text
I want a mouse
```

### 🎮 Specific Requirement

```text
Show me a gaming mouse
```

### 💡 Upselling

```text
What do you recommend with this?
```

### 🛒 Cart

```text
Add the Silent Wireless Mouse to my cart
```

### 🧠 Conversation Context

```text
Tell me about the RGB Gaming Mouse
```

Then:

```text
Add it to my cart
```

### 🚚 Dynamic Nudge

Add a product below the free-delivery threshold and observe RazorAI calculate how much more is needed.

### 💳 Checkout

```text
Checkout
```

### 🛡️ High-Value Transaction

Try:

```text
Add the K8 Wireless Mechanical Keyboard
```

Then:

```text
Checkout
```

The ₹2,000 transaction guardrail will be applied.

---

# 🛠️ Troubleshooting

## 🤖 "AI agent failed to respond"

The deployed application depends on external AI/API services, so temporary service or network failures can occasionally happen.

If you see:

```text
AI agent failed to respond
```

try:

1. **Refresh the page**
2. Wait a few seconds
3. Send the message again
4. If it still doesn't respond, start a fresh chat/session
5. Try again after a short delay

> A temporary AI/API timeout or service-limit issue does not necessarily mean that the application itself is broken.

---

## 💳 Payment Checkout Not Opening

Make sure:

* The transaction was successfully created
* You are using the deployed frontend
* Your browser is not blocking the checkout
* Razorpay is running in test mode for the demo

---

# 🏗️ High-Level Architecture

```text
                         ┌─────────────────┐
                         │      User       │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   RazorAI UI    │
                         │     React       │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Node / Express │
                         └────────┬────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
               ┌─────────┐  ┌──────────┐  ┌──────────┐
               │ Gemini  │  │ MongoDB  │  │Guardrails│
               │   AI    │  │          │  │          │
               └─────────┘  └──────────┘  └────┬─────┘
                                                │
                                                ▼
                                         ┌────────────┐
                                         │  Razorpay  │
                                         └─────┬──────┘
                                               │
                                               ▼
                                         ┌────────────┐
                                         │   Orders   │
                                         └─────┬──────┘
                                               │
                                               ▼
                                         ┌────────────┐
                                         │  Merchant  │
                                         │ Dashboard  │
                                         └────────────┘
```

---

# 🧰 Tech Stack

| Layer          | Technology    |
| -------------- | ------------- |
| Frontend       | React         |
| Backend        | Node.js       |
| API            | Express.js    |
| Database       | MongoDB       |
| AI             | Google Gemini |
| Payments       | Razorpay      |
| Deployment     | Render        |
| Agent Commerce | REST APIs     |

---

# 🎯 Why RazorAI?

RazorAI brings together three major pieces:

### 🤖 AI

Natural-language product discovery, conversation, recommendations, and shopping assistance.

### 💳 Commerce

Real payment-order creation through Razorpay's payment infrastructure.

### 🛡️ Trust

Backend-enforced transaction limits, explicit confirmation, stock validation, idempotency, and audit logging.

```text
        AI
        +
     Commerce
        +
       Trust
        =
     RazorAI
```

---

<div align="center">

# 🚀 RazorAI Commerce

### **From conversational shopping to agentic commerce.**

**AI can request.
The backend decides.
The merchant stays in control.**

<br>

<a href="https://razorai-commerce-frontend.onrender.com">
  <img src="https://img.shields.io/badge/🚀%20TRY%20RAZORAI-Live%20Demo-0A0A0A?style=for-the-badge" />
</a>

</div> 
