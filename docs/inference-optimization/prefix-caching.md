---
sidebar_position: 7
---

# Prefix caching

The term "KV cache" originally described caching within a single inference request. As mentioned previously, LLMs work autoregressively during decode as they output the next new token based on the previously generated tokens (i.e. reusing their KV cache). Without the KV cache, the model needs to recompute everything for the previous tokens in each decode step, which would be a huge waste of resources.

When extending this caching concept across multiple requests, it’s more accurate to call it **prefix caching** or **prompt caching**. The idea is simple: By caching the KV cache of an existing query, a new query that shares the same prefix can skip recomputing that part of the prompt. Instead, it directly reuses the cached results, reducing computational load and speeding up inference.

For example, consider a chatbot with this system prompt:

```bash
You are a helpful AI writer. Please write in a professional manner.
```

This prompt doesn’t change from one conversation to the next. Instead of recalculating it every time, you store its KV cache once. Then, when new messages come in, you reuse this stored prefix cache, only processing the new part of the prompt.

## Prefix cache-aware routing

In practice, applying prefix caching still has challenges. For example:

- How can a new request be routed to the worker that already has the right prefix cached?
- How does the router know what’s in each worker’s cache?

![prefix-caching-aware-routing.png](/img/docs/prefix-caching-aware-routing.png)

Different open-source projects are exploring their own approaches to prefix cache-aware routing:

- **Worker-reported prefix status**
    
    [Dynamo](https://github.com/ai-dynamo/dynamo) has workers actively report which prefixes they’ve cached. The router then uses this real-time data to make smart routing decisions.
    
- **Router-predicted cache status**
    
    [SGLang](https://github.com/sgl-project/sglang) maintains an approximate radix tree for each worker based on past requests. This helps the router predict which worker is most likely to have the needed prefix, without constant updates from the workers.
    
- **Hybrid efforts**
    - The Gateway API Inference Extension project is [exploring multiple strategies to implement a routing algorithm on EPP](https://github.com/kubernetes-sigs/gateway-api-inference-extension/issues/498):
        - **Prefix affinity consistent hashing**: Group requests with similar prefixes to the same worker.
        - **Approximate prefix cache on the router**: Let the router maintain an approximate lookup cache of the prefix caches on all the backend servers.
        - **Accurate prefix cache on the router**: Gather KV cache information reported by model servers.
    - The [llm-d](https://github.com/llm-d/llm-d) project uses a component called Inference Scheduler to implement filtering and scoring algorithms, and makes routing decisions based on a combination of factors like cache availability, prefill/decode status, SLA and load.