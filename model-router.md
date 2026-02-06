
# Model Router Architecture

> Intelligent model routing for nich serving 600,000+ DeFi users
> 

## Overview

The Model Router is an intelligent query routing system that selects the optimal LLM for each user query based on intent classification, complexity analysis, cost estimation, and provider health. It dramatically reduces costs (40-60% savings) while maintaining quality by using cheaper models for simple queries and premium models only when needed.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              nich CLIENT                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Chat UI    │  │  Terminal   │  │   Plugins   │  │    Bots     │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                │                │
│         └────────────────┴────────────────┴────────────────┘                │
│                                    │                                        │
│                          ┌─────────▼─────────┐                              │
│                          │ Routing Middleware│                              │
│                          └─────────┬─────────┘                              │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                          MODEL ROUTER SERVICE                               │
│                                    │                                        │
│  ┌─────────────────────────────────▼─────────────────────────────────────┐  │
│  │                          SEMANTIC CACHE                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │ Exact Match  │  │   Jaccard    │  │  Embedding   │                 │  │
│  │  │    Cache     │  │  Similarity  │  │  Similarity  │                 │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │  │
│  └─────────────────────────────────┬─────────────────────────────────────┘  │
│                                    │                                        │
│         ┌──────────────────────────┼──────────────────────────────┐         │
│         │                          ▼                              │         │
│  ┌──────┴──────┐  ┌────────────────────────────────┐  ┌───────────┴────┐    │
│  │   Intent    │  │         MODEL ROUTER           │  │    Budget      │    │
│  │ Classifier  │  │  ┌──────────────────────────┐  │  │   Manager      │    │
│  │             │  │  │      Rules Engine        │  │  │                │    │
│  │ ┌─────────┐ │  │  └──────────────────────────┘  │  │ ┌────────────┐ │    │
│  │ │ Pattern │ │  │  ┌──────────────────────────┐  │  │ │Daily Limit │ │    │
│  │ │ Matcher │ │  │  │     Cost Estimator       │  │  │ └────────────┘ │    │
│  │ └─────────┘ │  │  └──────────────────────────┘  │  │ ┌────────────┐ │    │
│  │ ┌─────────┐ │  │  ┌──────────────────────────┐  │  │ │Weekly Limit│ │    │
│  │ │ Keyword │ │  │  │     Model Selector       │  │  │ └────────────┘ │    │
│  │ │ Scoring │ │  │  └──────────────────────────┘  │  │ ┌────────────┐ │    │
│  │ └─────────┘ │  │  ┌──────────────────────────┐  │  │ │Monthly Lim │ │    │
│  │ ┌─────────┐ │  │  │     Tool Analyzer        │  │  │ └────────────┘ │    │
│  │ │  Groq   │ │  │  └──────────────────────────┘  │  │                │    │
│  │ │  LLM    │ │  └────────────────────────────────┘  └────────────────┘    │
│  │ └─────────┘ │                                                            │
│  └─────────────┘                                                            │
│                                    │                                        │
│  ┌─────────────────────────────────▼─────────────────────────────────────┐  │
│  │                        FALLBACK SYSTEM                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │   Circuit    │  │    Rate      │  │   Provider   │                 │  │
│  │  │   Breakers   │  │   Limiters   │  │    Health    │                 │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│  ┌─────────────────────────────────▼─────────────────────────────────────┐  │
│  │                          ANALYTICS                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │Query Logger  │  │Cost Tracker  │  │ Performance  │                 │  │
│  │  │              │  │              │  │   Monitor    │                 │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                          LLM PROVIDERS                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Anthropic│  │  OpenAI  │  │   Groq   │  │Cerebras  │  │ DeepSeek │       │
│  │  Claude  │  │  GPT-4   │  │  Llama   │  │  Llama   │  │   v3     │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Intent Classifier (`/classifier`)

The intent classifier determines the nature of user queries using a cascade approach:

```
Query → Pattern Matching → Keyword Scoring → LLM Classification
             80%+              15%               5%
```

**Pattern Matching** (Fastest - <1ms)
- Regex patterns for common query types
- DeFi-specific patterns (price checks, swaps, yields)
- Emergency keyword detection
- Handles 80%+ of queries

**Keyword Scoring** (Fast - 1-5ms)
- Token extraction and scoring
- Protocol mentions (Uniswap, Aave, etc.)
- Token mentions (ETH, BTC, USDT)
- Weighted keyword matching

**LLM Classification** (Accurate - 50-200ms)
- Uses Groq Llama 3.3 70B
- Structured output with confidence
- Only for ambiguous queries (~5%)

**Intent Categories:**

All 11 intent categories from `/src/services/model-router/intents/categories.ts`:

| Category | Description | Model Tier | Example Queries |
| --- | --- | --- | --- |
| `greeting` | Simple greetings, thanks, casual chat | free | “GM frens”, “Hey there!”, “Thanks!” |
| `simple_query` | Basic questions with short answers | free | “What is Ethereum?”, “How does staking work?” |
| `price_check` | Token price lookups | free | “What is ETH price?”, “SPA token price” |
| `data_lookup` | Fetching stats like gas, TVL | cheap | “Current gas price?”, “Show Aave TVL” |
| `tool_execution` | Single tool calls | standard | “Show my portfolio”, “Get my wallet balances” |
| `multi_tool` | Multiple tools in sequence | standard | “Show portfolio and find best yields for USDC” |
| `artifact_generation` | Charts, documents, dashboards | standard | “Create portfolio pie chart”, “Generate tax report” |
| `complex_analysis` | Deep analysis, risk assessment | premium | “Analyze my portfolio risk”, “Optimize yield strategy” |
| `planning` | Multi-step planning, DCA strategies | premium | “Create DCA plan for ETH over 6 months” |
| `code_generation` | Code, scripts, smart contracts | premium | “Write a price alert bot”, “Create vesting contract” |
| `emergency` | Urgent security issues | standard | “My wallet was hacked!”, “Revoke token approvals” |

**Category Keywords (excerpt):**

```tsx
// From categories.ts - used for fast pattern matching
greeting: ['hi', 'hello', 'gm', 'gn', 'thanks', 'yo', 'sup']
price_check: ['price', 'worth', 'cost', 'trading at', 'market cap']
emergency: ['hack', 'scam', 'compromised', 'stolen', 'drain', 'urgent', 'revoke']
complex_analysis: ['analyze', 'optimize', 'assess', 'risk', 'security', 'audit']
```

### 2. Model Router (`/router`)

The core routing engine that orchestrates model selection:

**Rules Engine**
- Intent → Model tier mapping
- Complexity score adjustments
- Tool capability requirements
- User preference overrides

**Cost Estimator**
- Input/output token estimation
- Per-model pricing calculation
- Budget constraint checking
- Cost comparison across models

**Model Selector**
- Capability matching (tools, vision, JSON mode)
- Performance scoring (latency, quality)
- Provider health weighting
- Final model ranking

**Selection Algorithm:**

```
Score = (Quality × QualityWeight) +
        (Speed × SpeedWeight) +
        (CostEfficiency × CostWeight) +
        (ProviderHealth × HealthWeight) +
        (CapabilityMatch × CapWeight)
```

### 3. Semantic Cache (`/cache`)

Intelligent caching to reduce redundant classifications:

```
┌─────────────────────────────────────────────────────────────┐
│                     CACHE LOOKUP                            │
│                                                             │
│  Query: "What's ETH price?"                                 │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Normalize Query                                  │    │
│  │    → "eth price"                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 2. Exact Match Check (O(1))                         │    │
│  │    → Hash lookup in Map                             │    │
│  │    → HIT: Return cached result                      │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │ MISS                             │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 3. Jaccard Similarity Search                        │    │
│  │    → Compare tokens: ["eth", "price"]               │    │
│  │    → Similar: "What is ETH price now?"              │    │
│  │    → Threshold: 0.85                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │ MISS                             │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 4. Full Classification (fallback)                   │    │
│  │    → Run classifier                                 │    │
│  │    → Store in cache                                 │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- 10,000 entry LRU cache
- 5-minute TTL (configurable)
- DeFi-specific normalization
- Optional embedding similarity
- 85%+ hit rate in production

### 4. Fallback System (`/fallback`)

Resilient handling of provider failures:

**Circuit Breakers**

```
          ┌───────────────────────────────────────┐
          │           CIRCUIT BREAKER             │
          │                                       │
          │  ┌─────────┐    ┌─────────┐           │
          │  │ CLOSED  │───▶│  OPEN   │           │
          │  │ (normal)│    │(failing)│           │
          │  └────┬────┘    └────┬────┘           │
          │       │              │                │
          │       │    ┌─────────▼─────────┐      │
          │       │    │    HALF-OPEN      │      │
          │       │    │ (testing recovery)│      │
          │       │    └─────────┬─────────┘      │
          │       │              │                │
          │       └──────────────┘                │
          └───────────────────────────────────────┘
```

- Failure threshold: 5 errors
- Reset timeout: 30 seconds
- Half-open test: 1 request

**Rate Limiters**
- Per-provider limits
- Per-user limits
- Sliding window algorithm
- Graceful degradation

**Provider Health Monitoring**
- Periodic health checks (30s interval)
- Latency tracking
- Error rate calculation
- Automatic failover

### 5. Analytics (`/analytics`)

Comprehensive tracking and monitoring:

**Query Logger**
- All routing decisions logged
- Model used, cost, latency
- Intent classification
- Tools invoked

**Cost Tracker**
- Real-time cost accumulation
- Per-user/per-model breakdown
- Daily/weekly/monthly aggregation
- Budget alerts

**Performance Monitor**
- Response latency (p50, p95, p99)
- Classification accuracy
- Cache hit rates
- Error rates

**Budget Manager**
- User budget limits
- Soft/hard limits
- Period types (daily/weekly/monthly)
- Alert thresholds (80% warning)

### 6. Tool Analyzer (`/tools`)

Analyzes queries for tool requirements:

**Tool Detection**
- Keyword → Tool mapping
- Multi-tool detection
- Capability requirements

**Tool-Model Mapping**
- DeFi tools → Models with tool calling
- Code execution → Artifact models
- Vision → Multimodal models

## Data Flow

### Standard Request Flow

```
1. User sends query
   │
2. Routing middleware intercepts
   │
3. Check semantic cache
   │ HIT → Return cached routing
   │
4. Classify intent (Pattern → Keyword → LLM)
   │
5. Analyze tool requirements
   │
6. Check user budget
   │ EXCEEDED → Use budget-safe model
   │
7. Apply routing rules
   │
8. Score candidate models
   │
9. Check provider health
   │ UNHEALTHY → Exclude from candidates
   │
10. Select best model
    │
11. Cache routing decision
    │
12. Return model + fallback chain
    │
13. Log to analytics
```

### Fallback Flow

```
1. Primary model call fails
   │
2. Circuit breaker records failure
   │ OPEN → Skip to next
   │
3. Try next in fallback chain
   │
4. Update provider health
   │
5. Log failure analytics
   │
6. Continue until success or exhausted
```

## Integration Points

### Chat System Integration

```tsx
// src/services/model-router/integration/routing-middleware.ts

// Middleware intercepts chat requests
const routedRequest = await routingMiddleware.route(chatRequest);

// Model is selected based on query
const response = await callLLM(routedRequest.selectedModel, query);

// Analytics logged after completion
await analyticsLogger.logCompletion(requestId, result);
```

### API Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/model-router/route` | POST | Preview routing decision |
| `/api/model-router/health` | GET | Provider health status |
| `/api/model-router/analytics/usage` | GET | Usage breakdown |
| `/api/model-router/analytics/costs` | GET | Cost breakdown |
| `/api/model-router/analytics/performance` | GET | Performance metrics |
| `/api/model-router/budget` | GET/POST | Budget management |

### Feature Flags

```tsx
// Controlled via environment
MODEL_ROUTER_ENABLED=true
MODEL_ROUTER_CACHE_ENABLED=true
MODEL_ROUTER_ANALYTICS_ENABLED=true
```

## Scaling Considerations

### Current Architecture (600K users)

- **Semantic Cache**: In-memory, ~10MB per 10K entries
- **Analytics**: In-memory aggregation, periodic flush to DB
- **Health Checks**: Single instance monitoring

### Future Scaling (1M+ users)

**Distributed Cache**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ App Server 1│    │ App Server 2│    │ App Server 3│
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                   ┌──────▼──────┐
                   │    Redis    │
                   │   Cluster   │
                   └─────────────┘
```

**Analytics Pipeline**

```
App Servers → Kafka → ClickHouse → Grafana
```

**Multi-Region Routing**
- Regional provider preferences
- Latency-based selection
- Geo-aware caching

## Model Tiers & Costs

| Tier | Models | Cost Range | Use Cases |
| --- | --- | --- | --- |
| **Free** | Groq Llama, Cerebras | $0 | Greetings, simple Q&A |
| **Cheap** | GPT-4o-mini, Claude Haiku | $0.001-0.005/query | Price checks, data lookup |
| **Standard** | GPT-4o, Claude Sonnet 4 | $0.01-0.05/query | Tool execution, artifacts |
| **Premium** | Claude Opus 4, GPT-4o | $0.05-0.15/query | Complex analysis, planning |

## Security Considerations

1. **API Key Protection**
    - Keys stored in environment variables
    - Never logged or exposed
    - Rotated periodically
2. **Rate Limiting**
    - Per-user request limits
    - Per-provider call limits
    - DDoS protection
3. **Budget Controls**
    - Hard limits to prevent runaway costs
    - Alert thresholds
    - Admin overrides
4. **Audit Logging**
    - All routing decisions logged
    - Cost tracking
    - Anomaly detection

## File Structure

```
src/services/model-router/
├── index.ts              # Public exports
├── types.ts              # Shared types
├── factory.ts            # Router instance factory
├── classifier/           # Intent classification
│   ├── index.ts         # Classifier exports
│   ├── patterns.ts      # Regex patterns
│   ├── keywords.ts      # Keyword scoring
│   ├── llm-classifier.ts # Groq LLM fallback
│   └── training-data.ts # Training examples
├── router/               # Core routing
│   ├── index.ts         # Router exports
│   ├── router.ts        # Main router class
│   ├── rules-engine.ts  # Routing rules
│   ├── cost-estimator.ts # Cost calculation
│   └── model-selector.ts # Model selection
├── cache/                # Semantic caching
│   ├── semantic-cache.ts # Cache implementation
│   ├── normalizer.ts    # Query normalization
│   └── warm-cache.ts    # Cache warming
├── fallback/             # Fallback handling
│   ├── index.ts         # Fallback exports
│   ├── circuit-breaker.ts # Circuit breaker
│   ├── rate-limiter.ts  # Rate limiting
│   └── provider-health.ts # Health monitoring
├── analytics/            # Analytics & monitoring
│   ├── index.ts         # Analytics exports
│   ├── query-logger.ts  # Query logging
│   ├── cost-tracker.ts  # Cost tracking
│   ├── budget-manager.ts # Budget management
│   └── performance-monitor.ts # Performance
├── providers/            # Provider configs
│   └── models.ts        # Model configurations
├── tools/                # Tool analysis
│   ├── analyzer.ts      # Tool analyzer
│   ├── mappings.ts      # Tool-model mappings
│   └── keywords.ts      # Tool keywords
└── integration/          # System integration
    └── routing-middleware.ts # Chat middleware
```

## Related Documentation

- [API Documentation](./API.md)
- [Configuration Reference](./CONFIGURATION.md)
- [Operations Runbook](./RUNBOOK.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Migration Guide](./MIGRATION.md)
