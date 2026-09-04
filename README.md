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
RazorAI can understand the request, search the merchant's catalog, recommend suitable products, add the selected product to the cart, and help the user proceed toward checkout.The key idea is that AI does not get unrestricted control over financial transactions.PlaintextUser
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
AI can request a transaction. The backend decides whether that transaction is allowed.🔗 Quick AccessResource🚀Live Store — https://razorai-commerce-frontend.onrender.com📊Merchant Dashboard — https://razorai-commerce-dashboard.onrender.com⚙️Agent Backend — https://razorai-commerce-backend.onrender.com💻GitHub Repository — YOUR_GITHUB_REPO_LINK🎥Demo Video — YOUR_VIDEO_LINK🛡️ Governance & Trust ArchitectureRazorAI adheres strictly to the Explainable, Bounded, Gated framework to keep autonomous agents secure and accountable.Plaintext                                  ┌───────────────────────────┐
                                  │      User / AI Agent      │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │   Checkout Request Received│
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │ 1. BOUNDED: Check Limit   │
                                  │   checkTransactionLimit() │
                                  └─────────────┬─────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       │                                                 │
          Amount <= ₹2,000                                        Amount > ₹2,000
                       │                                                 │
                       ▼                                                 ▼
        ┌──────────────────────────────┐                 ┌──────────────────────────────┐
        │ 2. EXPLAINABLE: Reason Log   │                 │ 2. EXPLAINABLE: Reason Log   │
        │ "Within autonomous limit"    │                 │ "Exceeds autonomous limit"   │
        └──────────────┬───────────────┘                 └──────────────┬───────────────┘
                       │                                                 │
                       ▼                                                 ▼
        ┌──────────────────────────────┐                 ┌──────────────────────────────┐
        │ Direct Razorpay Order        │                 │ 3. GATED: Gate Blocked       │
        │ Creation                     │                 │ Order Status:                │
        └──────────────┬───────────────┘                 │ PENDING_APPROVAL            │
                       │                                 └──────────────┬───────────────┘
                       │                                                 │
                       │                                                 ▼
                       │                                 ┌──────────────────────────────┐
                       │                                 │ Human / Admin Manual         │
                       │                                 │ Approval Action              │
                       │                                 │ POST /api/order/:id/approve │
                       │                                 └──────────────┬───────────────┘
                       │                                                 │
                       └────────────────────────┬────────────────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │ Razorpay Payment Process  │
                                  └─────────────┬─────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       │                                                 │
              Verification Success                              Verification Failure
                       │                                                 │
                       ▼                                                 ▼
        ┌──────────────────────────────┐                 ┌──────────────────────────────┐
        │ • Order Status: "completed"  │                 │ • Order Status: "failed"     │
        │ • Clear User Cart            │                 │ • Cart Preserved for Retry   │
        │ • Log to Audit Trail         │                 │ • Audit Result: "failure"    │
        │ • Update Dashboard           │                 │ • Show "Retry Payment" Page  │
        └──────────────────────────────┘                 └──────────────────────────────┘
1. 🔍 Explainable (Clear AI Reasoning)Every action taken by RazorAI produces explicit reasoning traces and structured log entries explaining why an action was executed, permitted, or gated.Audit Reason Field: Every audit log records a human-readable explanation (e.g., "Amount ₹3698 exceeds autonomous limit of ₹2000" or "Cart total ₹1799 is within the autonomous limit, AI is allowed to proceed autonomously").AI Reasoning Traces: The platform details the dynamic logic used by the agent during product checks and cart calculations.2. 📏 Bounded (Strict Financial Guardrails)₹2,000 Autonomous Transaction Limit: Every transaction request passes through the backend function checkTransactionLimit().Automatic Gate Trigger: If the total cart amount exceeds ₹2,000, requiresApproval is dynamically set to true, blocking direct payment initialization.3. 🚧 Gated (Human-in-the-Loop Interventions)Zero Bypassing: Transactions exceeding the threshold cannot create a valid Razorpay Order until explicit manual authorization is given.Approval Endpoint: The backend exposes POST /api/order/:orderId/approve — only upon executing this approval route will the system generate the required payment credentials for checkout.📜 Audit TrailAll transactions, guardrail evaluations, and agent interactions are continuously logged in a dedicated MongoDB collection (AuditLog) for full regulatory and operational transparency.📊 Logged Data ParametersEvery entry captures:Action: SEARCH, ADD_TO_CART, REMOVE_FROM_CART, CHECKOUT, LIMIT_CHECK, APPROVAL_REQUEST, PAYMENT_VERIFYActor: User ID or External AI Agent IDAmount: Transaction monetary valueReason: Human-readable explanation of the operational decisionSession ID: Unique user or agent session tracking keyApproval Status: AUTONOMOUS, PENDING_APPROVAL, APPROVED, REJECTEDResult: SUCCESS or FAILURETimestamp: High-resolution ISO timestamp🔍 Audit API EndpointMerchants and administrators can retrieve historical logs ordered chronologically (latest-first) via:HTTPGET /api/audit
🛡️ Graceful Failure Handling: Payment VerificationTo prevent poor user experiences and transaction state mismatches, RazorAI safely handles payment verification failures.PlaintextPayment Verification Request
              ↓
  Signature Valid?
     ↙          ↘
  YES            NO
   ↓              ↓
Complete      Failure State Triggered
Order         ┌──────────────────────────────────────────────┐
              │ 1. Mark Order Status as "failed"             │
              │ 2. Preserve User Cart (Do NOT clear)        │
              │ 3. Log Audit Trail (Result: "failure")       │
              │ 4. Direct User to "Payment Failed" Page      │
              │ 5. Display "Retry Payment" Action              │
              └──────────────────────────────────────────────┘
🔁 Verification Failure WorkflowSignature Mismatch Detection: If a tampered, incomplete, or failed payment notification is returned during Razorpay verification, the backend instantly marks the order status as "failed".Cart Preservation: Unlike conventional systems that purge carts immediately upon checkout initiation, RazorAI preserves all items in the customer's cart if payment verification fails.Audit Tracking: An audit log entry is saved with result: "failure" alongside the failure signature details.Interactive Recovery UI: The frontend presents a dedicated "Payment Couldn't Be Completed" status page complete with a single-click "Retry Payment" button that restores the cart session.✨ FeaturesRazorAI's capabilities are organized by their role in the overall platform.⭐ Must-Have FeaturesThe core features that power the AI shopping experience.🤖 Conversational Shopping AgentUsers can interact with the store using natural language instead of traditional e-commerce navigation.Plaintext"I want a mouse"

"Show me gaming keyboards"

"Which one is better?"

"Add the Silent Wireless Mouse"

"Remove the keyboard"

"Checkout"
The AI understands the user's intent and uses the appropriate backend capability.🔎 AI Product DiscoveryRazorAI searches the actual merchant catalog when users are looking for products.The agent can understand requests based on:Product typeCategoryFeaturesUser requirementsNatural-language descriptionsThe AI does not invent products, prices, or stock information.🛒 Conversational Cart ManagementUsers can manage their cart directly through conversation.Plaintext"Add the Silent Wireless Mouse"

"Add two keyboards"

"Remove the mouse"

"Add this one"
Products are only added when the user explicitly requests the action.💳 AI-Assisted CheckoutUsers can initiate checkout naturally:Plaintext"Checkout"

"Buy everything in my cart"

"Place the order"

"Proceed with the purchase"
The backend validates the transaction before creating the Razorpay payment order.🛡️ ₹2,000 Autonomous Transaction GuardrailRazorAI has a configured autonomous transaction limit of:₹2,000Transactions within the limit can proceed through the autonomous flow.Transactions above the limit require additional approval.Plaintext₹899
  ↓
Within ₹2,000 limit
  ↓
Autonomous transaction
Plaintext₹2,299
  ↓
Above ₹2,000 limit
  ↓
Approval required
👤 Human-in-the-Loop ApprovalHigh-value purchases are not blindly processed by the AI.For example:PlaintextK8 Wireless Mechanical Keyboard
₹2,299
        ↓
Autonomous limit exceeded
        ↓
PENDING_APPROVAL
This creates a safety boundary between AI decision-making and financial execution.💰 Revenue & Upselling FeaturesRazorAI is designed to help merchants increase cart value while keeping recommendations useful and contextual.🛍️ Smart Product UpsellingAfter a customer adds a product to the cart, RazorAI can suggest relevant complementary products.Example:PlaintextCustomer adds:
🖱️ Silent Wireless Mouse

RazorAI suggests:
🖱️ Gaming Mousepad
⌨️ Wireless Keyboard
Recommendations are based on products actually available in the merchant catalog.🔄 Context-Aware Cross-SellingRazorAI can suggest products that naturally complement what the customer is already buying.Examples:PlaintextMouse
  ↓
Mousepad
PlaintextKeyboard
  ↓
Mouse
PlaintextMonitor
  ↓
Laptop Stand
This creates opportunities for merchants to increase the customer's basket size without forcing irrelevant recommendations.🚚 Dynamic Free-Delivery NudgesRazorAI dynamically checks the customer's cart value and tells them exactly how much more they need to spend to unlock free delivery.Example:PlaintextCart Total: ₹899

🛍️ Add ₹601 more to unlock free delivery!
If the cart changes:PlaintextCart Total: ₹1,700

🛍️ Add ₹300 more to unlock free delivery!
The nudge changes dynamically according to the cart total and configured threshold.This gives the customer a clear incentive while creating an opportunity for merchants to increase Average Order Value (AOV).📈 AOV OptimizationCombining:PlaintextRelevant Upselling
        +
Cross-Selling
        +
Free-Delivery Nudges
        ↓
Higher Basket Value
RazorAI turns the AI assistant into more than a support chatbot — it can also become a conversational sales assistant.🎯 Context-Aware RecommendationsRecommendations are connected to the customer's current shopping context.Instead of randomly suggesting products, RazorAI can use:Current productCart contentsProduct categoryAvailable catalogUser's conversationto provide more relevant suggestions.🚀 Extra FeaturesFeatures that extend RazorAI beyond a conventional AI shopping chatbot.🤖 Agent-to-Agent CommerceRazorAI is designed to be accessible by other AI agents, not just human users.A machine-readable catalog is exposed through:HTTPGET /api/v1/agent/catalog
External agents can discover:PlaintextMerchant
Products
Prices
Stock
Categories
Features
Purchase Support
Agent Capabilities
Transaction Limits
External agents can request transactions through:HTTPPOST /api/v1/agent/transact
This creates the foundation for:Agent → Merchant → Paymentcommerce.🔗 AI-Readable Merchant CatalogThe merchant exposes structured catalog information that external AI agents can understand without scraping the website.Example:JSON{
  "agent_purchasable": true,
  "capabilities": {
    "catalog": true,
    "product_search": true,
    "purchase": true,
    "razorpay_payment": true,
    "autonomous_transaction_limit": 2000
  }
}
This makes the merchant AI-readable and AI-purchasable.🔁 Conversational IdempotencyAI agents and users can accidentally repeat checkout requests because of retries, slow responses, or network latency.RazorAI includes idempotency protection around transaction requests to reduce the risk of duplicate payment-order creation.PlaintextCheckout Request
      ↓
Idempotency Check
      ↓
Already Processed?
   ↙         ↘
 YES         NO
 ↓             ↓
Reuse         Process
Existing     Transaction
Result
This is especially important when AI is involved in financial workflows.🧠 Conversation MemoryRazorAI maintains the ongoing conversation context so users don't have to repeatedly specify product names.It understands references such as:Plaintextthis
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
Example:PlaintextUser:
Tell me about the RGB Gaming Mouse.

RazorAI:
...

User:
Add it to my cart.

RazorAI:
Adds the previously discussed mouse.
🔮 Seeing the FutureRazorAI is built around the idea that AI agents will become a new interface for commerce.Today's CommercePlaintextHuman
  ↓
Website
  ↓
Product
  ↓
Checkout
Agentic CommercePlaintextUser
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
Imagine telling your AI:Plaintext"Find me a good wireless mouse under ₹1500
and purchase it if you find a suitable one."
The AI agent could discover compatible merchants, evaluate their catalogs, select a product, and request a transaction.The merchant backend would still enforce its own rules before allowing the transaction.The Bigger IdeaRazorAI is not only an AI shopping assistant.It is a step toward a world where:Websites are no longer the only interface to commerce. AI agents become the interface.🔐 Security FeaturesFinancial actions require stronger controls than normal conversational responses.🛡️ Backend-Enforced Transaction ControlThe AI does not directly decide whether a payment should happen.PlaintextAI Intent
   ↓
Backend Validation
   ↓
Guardrails
   ↓
Transaction Decision
   ↓
Razorpay
The backend remains the final authority.🔁 Idempotency ProtectionRepeated transaction requests are protected against unnecessary duplicate processing.This is especially important for:AI retriesNetwork delaysDuplicate user commandsRepeated checkout requests🧾 Audit LoggingImportant agent transaction events are recorded for traceability.Examples:PlaintextAGENT_TRANSACTION_APPROVED
AGENT_TRANSACTION_REJECTED
AGENT_TRANSACTION_ESCALATED
This provides visibility into important AI-driven commerce decisions.🛑 Explicit Purchase ConsentRazorAI separates:PlaintextAdding something to the cart
from:PlaintextActually purchasing something
The AI does not automatically checkout just because an item was added.Higher-value transactions require explicit confirmation before proceeding.📦 Stock ValidationThe backend checks product availability before creating a transaction.The AI cannot override the merchant's actual stock state.🏪 Merchant ValueRazorAI gives the merchant a dedicated operational layer instead of making the AI the only interface.📊 Merchant VisibilityThe merchant can monitor the commerce activity generated through RazorAI from the dedicated dashboard.📈 Conversion OpportunitiesThe combination of:PlaintextConversational Discovery
        +
Upselling
        +
Cross-Selling
        +
Free-Delivery Nudges
        +
Low-Friction Checkout
creates multiple opportunities to improve the shopping journey and increase order value.🤖 New AI Commerce ChannelA2A support allows external AI agents to interact with the merchant's catalog and transaction API.Instead of relying only on:PlaintextHuman → Website
the merchant can prepare for:PlaintextAI Agent → Merchant
as another potential commerce channel.🛡️ Controlled AutomationMerchants can automate lower-value transactions while maintaining stronger approval requirements for higher-value purchases.This balances:Automation + Conversion + Risk Control📦 Product CatalogRazorAI uses a structured merchant catalog containing multiple product categories.Current Catalog Categories⌨️ Keyboards🖱️ Mice🖱️ Mousepads🖥️ Monitors🎧 Audio🔌 AccessoriesProducts contain structured information such as:PlaintextProduct
├── Name
├── Description
├── Price
├── Currency
├── Stock
├── Features
├── Category
└── Purchase Support
The same catalog powers both:Human-facing AI shoppingandMachine-facing Agent Commerce APIs.📊 Merchant DashboardRazorAI includes a dedicated merchant dashboard:📊 https://razorai-commerce-dashboard.onrender.com/The dashboard provides the merchant with visibility into the commerce activity generated through the platform.It includes information such as:📦 Orders💰 Revenue📊 Sales activity🛒 Transaction information🤖 Agent-driven commerce activity📜 Live Audit Logs & Guardrail Approvals🔄 Store → Payment → DashboardPlaintextCustomer / AI Agent
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
As orders and successful transactions are processed, the corresponding order and revenue information is reflected in the merchant dashboard.This gives the merchant a separate operational view from the customer's shopping experience.🎥 Demo VideoSee the complete RazorAI experience in action:▶️ Demo VideoYOUR_VIDEO_LINKThe demo showcases:PlaintextAI Product Discovery
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
💳 How to Test Razorpay CheckoutRazorAI uses Razorpay Test Mode for demonstration purposes.When the Razorpay test checkout opens, use:PlaintextCard Number:
5555 5100 0008 1006

Expiry:
Any future date

OTP:
1234
⚠️ This is a test-mode payment flow. No real money is charged.If the checkout asks for additional test-card fields such as CVV, use the value accepted by the Razorpay test environment.🧪 Try These PromptsOpen the live store and try the following.🔎 Product DiscoveryPlaintextI want a mouse
🎮 Specific RequirementPlaintextShow me a gaming mouse
💡 UpsellingPlaintextWhat do you recommend with this?
🛒 CartPlaintextAdd the Silent Wireless Mouse to my cart
🧠 Conversation ContextPlaintextTell me about the RGB Gaming Mouse
Then:PlaintextAdd it to my cart
🚚 Dynamic NudgeAdd a product below the free-delivery threshold and observe RazorAI calculate how much more is needed.💳 CheckoutPlaintextCheckout
🛡️ High-Value TransactionTry:PlaintextAdd the K8 Wireless Mechanical Keyboard
Then:PlaintextCheckout
The ₹2,000 transaction guardrail will be applied.🛠️ Troubleshooting🤖 "AI agent failed to respond"The deployed application depends on external AI/API services, so temporary service or network failures can occasionally happen.If you see:PlaintextAI agent failed to respond
try:Refresh the pageWait a few secondsSend the message againIf it still doesn't respond, start a fresh chat/sessionTry again after a short delayA temporary AI/API timeout or service-limit issue does not necessarily mean that the application itself is broken.💳 Payment Checkout Not OpeningMake sure:The transaction was successfully createdYou are using the deployed frontendYour browser is not blocking the checkoutRazorpay is running in test mode for the demo🏗️ High-Level ArchitecturePlaintext                          ┌─────────────────┐
                          │      User       │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   RazorAI UI    │
                          │      React      │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  Node / Express │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
               ┌─────────┐   ┌──────────┐   ┌──────────┐
               │ Gemini  │   │ MongoDB  │   │Guardrails│
               │   AI    │   │ (Audit)  │   │  & Gates │
               └─────────┘   └──────────┘   └────┬─────┘
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
🧰 Tech StackLayerTechnologyFrontendReactBackendNode.jsAPIExpress.jsDatabaseMongoDBAIGoogle GeminiPaymentsRazorpayDeploymentRenderAgent CommerceREST APIs🎯 Why RazorAI?RazorAI brings together three major pieces:🤖 AINatural-language product discovery, conversation, recommendations, and shopping assistance.💳 CommerceReal payment-order creation through Razorpay's payment infrastructure.🛡️ TrustBackend-enforced transaction limits, explicit confirmation, stock validation, idempotency, and audit logging.Plaintext        AI
        +
     Commerce
        +
      Trust
        =
     RazorAI
🚀 RazorAI CommerceFrom conversational shopping to agentic commerce.AI can request.
The backend decides.
The merchant stays in control.
