---
sidebar_position: 3
---

# PagedAttention

PagedAttention is a memory-efficient approach to implementing the attention mechanism in LLMs.

When an LLM is generating a response, it needs to remember past information (i.e. the KV cache) for every token it generates. Normally, the KV cache takes up a big chunk of memory because it’s stored as one giant continuous block. This can lead to memory fragmentation or wasted space because you need to reserve a big block even if you don’t fill it fully.

PagedAttention breaks this big chunk into smaller blocks, kind of like pages in a book. In other words, the KV cache is stored in non-contiguous blocks. It then uses a lookup table to keep track of these blocks. The LLM only loads the blocks it needs, instead of loading everything at once.

This saves memory and makes the whole process more efficient. It even allows the same blocks to be shared across different outputs if needed.

PagedAttention was first implemented by vLLM. Since then, other projects like Hugging Face TGI and TensorRT-LLM have also adopted and implemented PagedAttention.