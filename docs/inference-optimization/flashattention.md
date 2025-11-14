---
sidebar_position: 4
description: FlashAttention is a fast, memory-efficient attention algorithm for Transformers that accelerates LLM training and inference and helps achieve longer context windows.
keywords:
    - FlashAttention
    - LLM inference optimization, LLM inference optimization techniques​
    - Speed up LLM inference
---

import LinkList from '@site/src/components/LinkList';

# FlashAttention

FlashAttention is an optimized algorithm for computing the attention mechanism in Transformer models. It’s faster, more memory-efficient, and more scalable than standard attention. Introduced in the paper [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135), it has since become a widely adopted attention backend for both training and inference in modern LLMs.

## Why attention is slow in the first place

When an LLM reads text, it has to look at every token and compare it with every other token to understand the relationships. This is called [attention](https://arxiv.org/abs/1706.03762).

The standard attention mechanism has a fundamental problem: **it's memory-bound rather than compute-bound**. To understand this, we need to look at what happens during attention computation.

Standard attention calculates:

$$
\text{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

The naive implementation follows these steps:

1. **Compute the attention scores**: Multiply Q and K^T to get an N×N matrix (where N is sequence length)
2. **Apply softmax**: Normalize the scores
3. **Multiply by values**: Compute the weighted sum with V

The problem is the memory access pattern. Modern GPUs have:

- **High Bandwidth Memory (HBM)**: Large but slow (1-2 TB/s bandwidth)
- **SRAM (on-chip memory)**: Small but fast (10-20 TB/s bandwidth)

The standard implementation requires writing the full N×N attention matrix to HBM, then reading it back for the next operation. For a sequence length of 4096 tokens, this attention matrix contains ~16 million elements. With multiple reads and writes, the algorithm spends most of its time waiting for memory transfers rather than doing actual computation.

As sequence lengths increase:

- Memory traffic dominates runtime
- GPU utilization drops
- Long context windows become impractical

For example, 16K tokens require **256× more memory** than 1K tokens.

## How does FlashAttention work?

FlashAttention speeds up attention by reducing memory traffic. The core idea is to never materialize the full attention matrix in HBM. Instead, it uses two key techniques:

- **Tiling and recomputation**. FlashAttention breaks the computation into blocks (tiles) that fit in fast SRAM:
    - Load tiles of Q, K, V from HBM to fast SRAM
    - Compute attention for that tile entirely in SRAM
    - Update the output incrementally and discard intermediate results
- **Kernel fusion**. Rather than separate operations (matmul → softmax → matmul), FlashAttention fuses everything into a single GPU kernel. This means:
    - No writing intermediate results to HBM
    - No separate kernel launches (which have overhead)
    - All operations happen in fast SRAM

<figure>
![flashattention-diagram.png](./img/flashattention-diagram.png)
<figcaption>FlashAttention uses tiling to prevent materialization of the large N×N attention matrix on HBM. [Image Source](https://arxiv.org/abs/2205.14135)</figcaption>
</figure>

Simply put, FlashAttention makes the attention computation more efficient. It reorganizes the work so the GPU spends less time waiting on memory and more time doing actual computation.

## The benefits of FlashAttention

FlashAttention provides major improvements in both speed and scalability:

- 2–4× faster attention
- Much lower memory usage since the N×N attention matrix isn't stored
- Allow LLMs to handle longer context windows (e.g., 128K tokens)
- Higher throughput and better GPU utilization
- Faster inference for chat, coding, reasoning, etc.

Currently, FlashAttention is widely used in:

- Training frameworks (PyTorch, DeepSpeed)
- Inference engines (vLLM, SGLang, Hugging Face TGI, TensorRT-LLM)
- Model architectures that support long context

## FlashAttention version comparison

As of today, FlashAttention has 4 major versions. Below is a side-by-side comparison that explains how the algorithm has evolved across versions.

| Version | Year | Key Improvements | Performance | Notes |
| --- | --- | --- | --- | --- |
| FlashAttention-1 | 2022 | Introduced the IO-aware, tiled attention algorithm. Fused softmax + matmul kernels. Avoided materializing the full attention matrix | 2–4× faster attention, up to 10× lower memory | First version; supports practical long-context; exact attention (no approximation) |
| FlashAttention-2 | 2023 | Better parallelism and work partitioning across warps; reduced non-matmul FLOPs | 2× faster than FA-1, especially on long sequences | Powers many long-context LLMs; widely integrated in inference/training frameworks |
| FlashAttention-3 | 2024 | Tensor core acceleration (FP8/BF16); optimized for Hopper GPUs (e.g., H100) | Up to 2× faster than FA-2 and 740 TFLOPS on H100 (75% util); reduced FP8 numerical error by 2.6× | Latest version; leverages new GPU features. Many frameworks still upgrading from FA-2 |

FlashAttention 4 is not officially released yet, but [Tri Dao previewed it at the HotChips conference](https://x.com/SemiAnalysis_/status/1960070677379133949), showing that it is up to 22% faster than the attention kernel implementation from cuDNN.

## How to use FlashAttention

The easiest way to get started is through the official package:

```python
pip install flash-attn --no-build-isolation
```

Recent PyTorch versions automatically dispatch to FlashAttention via `scaled_dot_product_attention` when supported. Read [the API reference](https://docs.pytorch.org/docs/stable/backends.html#torch.backends.cuda.can_use_flash_attention) to learn more.

Many inference frameworks have already integrated FlashAttention, including [vLLM](https://docs.vllm.ai/en/latest/getting_started/quickstart/#on-attention-backends) and [SGLang](https://docs.sglang.ai/advanced_features/attention_backend.html), but their versions may be different depending on their release cycle.

<LinkList>
  ## Additional resources
  * [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135)
  * [FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning](https://arxiv.org/abs/2307.08691)
  * [FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision](https://arxiv.org/abs/2407.08608)
</LinkList>