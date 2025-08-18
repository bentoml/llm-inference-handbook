---
sidebar_position: 4
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

When an LLM is generating a response, it needs to [remember past information (i.e. the KV cache) for every token it generates](../llm-inference-basics/how-does-llm-inference-work#the-two-phases-of-llm-inference). Normally, the KV cache takes up a big chunk of memory because it’s stored as one giant continuous block. This can lead to memory fragmentation or wasted space because you need to reserve a big block even if you don’t fill it fully.

PagedAttention breaks this big chunk into smaller blocks, kind of like pages in a book. In other words, the KV cache is stored in non-contiguous blocks. It then uses a lookup table to keep track of these blocks. The LLM only loads the blocks it needs, instead of loading everything at once.

This saves memory and makes the whole process more efficient. It even allows the same blocks to be shared across different outputs if needed.

PagedAttention was first implemented by vLLM. Since then, other projects like Hugging Face TGI and TensorRT-LLM have also adopted and implemented PagedAttention.

<LinkList>
  ## Additional resources
  * [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
</LinkList>