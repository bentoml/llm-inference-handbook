---
sidebar_position: 4
description: Learn how to calculate GPU memory for serving LLMs.
keywords:
    - GPU memory calculation, LLM inference hardware calculator
    - VRAM calculation
    - LLM memory requirements
---

import LinkList from '@site/src/components/LinkList';
import GPUMemoryCalculator from '@site/src/components/Calculator/GPUMemory';

# Calculating GPU memory for serving LLMs

If you're planning to self-host an LLM, one of the first things you'll need to figure out is how much GPU memory (VRAM) it requires. This depends mainly on the model’s size and the precision used during inference.

- **Model size (number of parameters)**. Larger models need more memory. Models with tens or hundreds of billions of parameters usually require high-end GPUs like NVIDIA H100 or H200.
- **Bit precision**. The precision used (e.g., FP16, FP8, INT8) affects memory consumption. Lower precision formats can significantly reduce memory footprint, but may have accuracy drops. See [LLM quantization](/model-preparation/llm-quantization) for details.

A rough formula to estimate how much memory is needed to load an LLM is:

```bash
Memory (GB) = P * (Q / 8) * (1 + Overhead)
```

- **P**: Number of parameters (in billions)
- **Q**: Bit precision (e.g., 16, 32), division by 8 converts bits to bytes
- **Overhead (%)**: Additional memory or temporary usage during inference (e.g., KV cache, activation buffers, optimizer states)

Use the calculator below to estimate GPU memory requirements for your model:

<GPUMemoryCalculator />

:::note
Not all GPUs support all precision formats natively. A100 and other Ampere GPUs support INT8 but do not support FP8 in hardware. Native FP8 requires Hopper, Ada, or newer architectures. If your inference stack relies on FP8 kernels, make sure your GPU supports them. Some 4-bit models use INT4 quantization, while native FP4 support relies on newer architectures and software stacks.
:::

<LinkList>
  ## Additional resources
  * [What is GPU Memory and Why it Matters for LLM Inference](https://www.bentoml.com/blog/what-is-gpu-memory-and-why-it-matters-for-llm-inference)
</LinkList>
