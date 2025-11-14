---
sidebar_position: 9
description: Challenges in applying prefix caching
keywords:
    - Prefix caching, prompt caching, context caching
    - KV cache, KV caching
    - Prefix aware routing
    - Distributed inference, distributed LLM inference
    - Inference optimization
    - Dynamo, SGLang, vLLM, llm-d
    - LLM inference optimization, LLM inference optimization techniques​
    - Speed up LLM inference
---

# Prefix-aware routing

In practice, applying [prefix caching](./prefix-caching) in a distributed way still has challenges. For example:

- How can a new request be routed to the worker that already has the right prefix cached?
- How does the router know what’s in each worker’s cache?

![prefix-caching-aware-routing.png](./img/prefix-caching-aware-routing.png)

Different open-source projects are exploring their own approaches to prefix-aware routing:

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