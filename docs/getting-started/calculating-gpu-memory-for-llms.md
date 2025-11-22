---
sidebar_position: 3
description: Learn how to calculate GPU memory for serving LLMs.
keywords:
    - GPU memory calculation, LLM inference hardware calculator
    - VRAM calculation
    - LLM memory requirements
---

import LinkList from '@site/src/components/LinkList';

# Calculating GPU memory for serving LLMs

If you're planning to self-host an LLM, one of the first things you'll need to figure out is how much GPU memory (VRAM) it requires. This depends mainly on the model’s size and the precision used during inference.

- **Model size (number of parameters)**. Larger models need more memory. Models with tens or hundreds of billions of parameters usually require high-end GPUs like NVIDIA H100 or H200.
- **Bit precision**. The precision used (e.g., FP16, FP8, INT8) affects memory consumption. Lower precision formats can significantly reduce memory footprint, but may have accuracy drops. See [LLM quantization](/getting-started/llm-quantization) for details.

A rough formula to estimate how much memory is needed to load an LLM is:

```bash
Memory (GB) = P * (Q / 8) * (1 + Overhead)
```

- **P**: Number of parameters (in billions)
- **Q**: Bit precision (e.g., 16, 32), division by 8 converts bits to bytes
- **Overhead (%)**: Additional memory or temporary usage during inference (e.g., KV cache, activation buffers, optimizer states)

For example, to load a 70B model in FP16 with 20% overhead, you need around 168 GB of GPU memory:

```bash
Memory = 70 × (16 / 8) × 1.2 = 168 GB
```

<LinkList>
  ## Additional resources
  * [What is GPU Memory and Why it Matters for LLM Inference](https://www.bentoml.com/blog/what-is-gpu-memory-and-why-it-matters-for-llm-inference)
</LinkList>