---
sidebar_position: 3
description: Improve LLM memory usage with block-based KV cache storage via PagedAttention.
keywords:
    - vLLM, Hugging Face TGI, TensorRT-LLM
    - PagedAttention
    - KV cache, KV cache optimization, KV caching
    - LLM inference optimization, LLM inference optimization techniques​
    - Speed up LLM inference
---

import LinkList from '@site/src/components/LinkList';

# PagedAttention

[PagedAttention](https://blog.vllm.ai/2023/06/20/vllm.html) is a memory-efficient approach to implementing the attention mechanism in LLMs.

## Why contiguous KV cache allocation wastes memory

When an LLM is generating a response, it needs to [remember past information (i.e. the KV cache) for every token it generates](../llm-inference-basics/how-does-llm-inference-work#the-two-phases-of-llm-inference). Normally, the KV cache takes up a big chunk of memory because it’s stored as one giant contiguous block. This can lead to memory fragmentation or wasted space because you need to reserve a big block even if you don’t fill it fully.

Specifically, early serving engines often allocated KV cache as a contiguous tensor sized for the worst case. A simplified shape is:

```text
2 × num_layers × num_heads × head_dim × max_seq_len
```

That allocation happens per active request, before accounting for batch size and the number of bytes per element. It is simple, but it assumes every request will use the maximum sequence length. Real traffic is variable: one request may generate a short answer, another may keep a long conversation alive, and another may stop early. If each request reserves memory for `max_seq_len`, much of the reserved GPU memory can sit unused.

The result is lower effective batch size, more memory fragmentation, and fewer concurrent requests. 

## How does PagedAttention work

PagedAttention changes the unit of allocation from a whole sequence to smaller KV blocks. As a sequence grows, the runtime allocates more blocks. When a request finishes, those blocks can be returned to the pool.

This is why PagedAttention matters beyond a single attention kernel. It gives the serving engine a better memory allocator for KV cache, which then makes techniques like [continuous batching](./static-dynamic-continuous-batching), [prefix caching](./prefix-caching), and [KV cache offloading](./kv-cache-offloading) easier to combine.

PagedAttention was first implemented by vLLM. Since then, other projects like Hugging Face TGI and TensorRT-LLM have also adopted and implemented PagedAttention.

<LinkList>
  ## Additional resources
  * [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
</LinkList>
