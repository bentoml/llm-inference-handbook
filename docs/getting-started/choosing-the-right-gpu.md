---
sidebar_position: 2
description: Select the right NVIDIA or AMD GPUs (e.g., L4, A100, H100, B200, MI250X, MI300X, MI350X) for LLM inference.
keywords:
    - NVIDIA GPUs, AMD GPUs
    - GPU inference
---

import LinkList from '@site/src/components/LinkList';
import Button from '@site/src/components/Button';

# Choosing the right GPU

For AI teams self-hosting LLMs, selecting the right GPU is one of the most important early decisions. The choice directly impacts throughput, latency, memory limits, and overall cost. It’s easy to rely on a GPU benchmark or a GPU comparison chart to guide that decision. However, those numbers rarely capture the full story of LLM workloads in a specific use case.

## GPUs vs. Graphics Cards vs. Accelerators

First, let’s clarify a few terms that are often used interchangeably but actually mean different things.

### GPU (Graphics Processing Unit)

The GPU is the processor chip itself. Originally designed for rendering graphics, it is capable of running thousands of calculations at once. In modern AI workloads, the GPU is the "brain" that does the heavy computational work.

### Graphics card

A graphics card is the full hardware package that contains a GPU. It includes the chip, memory (VRAM), cooling system, power connectors, and output ports. You might also see terms like “video card” or “graphics adapter.” The GPU is just one part of the card, but it’s the central component.

### Accelerator

Accelerators are a broader category of specialized hardware built to speed up certain types of computations. A GPU is one type of accelerator, but there are others, such as:

- AI/ML accelerators (e.g., Google TPUs, Intel NPUs)
- Cryptographic accelerators
- Physics processing units (PPUs)
- Field-programmable gate arrays (FPGAs) configured for specific tasks

The key difference: all modern graphics cards contain GPUs, and all GPUs are accelerators, but not all accelerators are GPUs or graphics-focused. Today, many GPUs are used primarily for non-graphics work like ML/AI training and inference, rather than image rendering.

If you rent compute from a cloud vendor, you usually just see the cost listed under **GPUs**. But when reading their marketing materials or blog posts, it’s important to know exactly what’s being described.

## Why GPU choice matters for inference

Modern AI applications are increasingly powered by Generative AI (GenAI) models like LLMs. Unlike traditional ML models, these models can reach hundreds of billions of parameters, like DeepSeek-V3.1 with 671B parameters. To run models at this scale, you need extremely powerful GPUs such as the NVIDIA H200 or AMD MI300X. This way, you can fully unlock their inference potential with the latest optimization techniques.

However, not every workload needs that much horsepower. Smaller open-source LLMs, such as Llama-3.1-8B, run efficiently on mid-range GPUs like the NVIDIA L4 or AMD MI250. Lightweight models can even run on entry-level cards or commodity cloud instances.

The key is to find the right GPU for the job to achieve the best price-performance ratio. The wrong choice can lead to bottlenecks, limiting throughput, increasing latency, and driving up cost.

## Understanding GPU types

Not all GPUs are built for the same purpose. When you check a GPU benchmark, you’ll often see a mix of data center cards, consumer graphics cards, and even mobile chips. It’s important to understand the major categories before selecting the right one for your inference workload.

### Consumer GPUs

These GPUs are originally made for gaming, but still widely used for smaller open-source LLMs and experimentation. They usually have less VRAM but are cost-effective. Examples include NVIDIA RTX 4090 or AMD Radeon RX 7900 XTX.

### Workstation GPUs

Workstation cards sit between consumer and data center hardware. They’re a good fit for professionals who need strong compute on a single machine, often for 3D design, visualization, or model prototyping. Cards like NVIDIA RTX A6000 or AMD Radeon Pro W6800 fall into this category.

### Data center GPUs

Enterprises rely on data center GPUs for large-scale AI inference and High-Performance Computing (HPC) workloads. They offer high VRAM (40–192GB), strong memory bandwidth, and features like multi-instance GPU (MIG) or NVLink for scaling across clusters. Examples include NVIDIA A100, H100 and B200, as well as AMD MI300X and MI350X.

For teams renting cloud compute or [deploying LLM on-prem](../infrastructure-and-operations/on-prem-llms), data center GPUs are usually the most practical choice.

## Key considerations for choosing GPUs

When selecting GPUs, remember that raw benchmark numbers don’t tell the whole story. The best choice depends on a combination of hardware specifications, workload size, and ecosystem support.

### GPU memory (VRAM)

[VRAM](https://www.bentoml.com/blog/what-is-gpu-memory-and-why-it-matters-for-llm-inference) sets the ceiling on model size and context length. For example, DeepSeek V3 and R1, with 671B parameters, require 8 NVIDIA H200 GPUs (141 GB each) to run. In contrast, smaller models such as Phi-3 can fit within 16–24GB when quantized.

A major challenge is the KV cache. Its size grows linearly with sequence length, meaning long-context workloads can quickly exhaust memory. To avoid bottlenecks, you need [distributed inference](../llm-inference-basics/distributed-inference) techniques like [prefill-decode disaggregation](../inference-optimization/prefill-decode-disaggregation) and [KV cache offloading](../inference-optimization/kv-cache-offloading).

### Memory bandwidth

Memory bandwidth determines how quickly tokens can be processed. You can prevent slowdowns by using higher-bandwidth cards like the NVIDIA H100 or AMD MI300X. However, you should fully test your model and inference runtime before deploying them into production.

### Compute throughput

Floating point operations per second (FLOPS) are commonly used to compare cards, but in practice what matters more is tokens per second. It becomes extremely important in high-concurrency scenarios, where latency directly affects user experience. To further improve throughput, you can apply techniques like [speculative decoding](../inference-optimization/speculative-decoding).

### Cost and availability

Consumer and workstation GPUs are accessible and cheaper but often limited in VRAM. Data center GPUs provide the scale and reliability for enterprise AI deployments, though **at a premium**. This is especially true for high-performance GPUs like NVIDIA H100 and H200.

For enterprise AI teams, a bigger challenge is what we call the **GPU CAP Theorem**: a GPU infrastructure cannot guarantee **Control**, on-demand **Availability**, and **Price** at the same time.

|  | Hyperscaler | NeoCloud (Serverless) | NeoCloud (Long-term Commitment) | On-Prem |
| --- | --- | --- | --- | --- |
| **Control** | ✅ High | ❌ Low | 🟡 Medium | ✅ High |
| On-demand **Availability** | 🟡 Medium | ✅ High | ❌ Low | ❌ Low |
| **Price** | ❌ High | 🟡 Medium | ✅ Low | 🟡 Medium |

For more information, see [How to Beat the GPU CAP Theorem in AI Inference](https://www.bentoml.com/blog/how-to-beat-the-gpu-cap-theorem-in-ai-inference).

### Ecosystem and framework support

A GPU is only as effective as the software that supports it. NVIDIA benefits from a mature CUDA Toolkit and TensorRT-LLM ecosystem. AMD’s ROCm stack is improving steadily, with growing support across PyTorch, vLLM, and SGLang.

Read the blog posts about the data center GPUs from NVIDIA and AMD for details:

- [NVIDIA Data Center GPUs Explained: From A100 to B200 and Beyond](https://www.bentoml.com/blog/nvidia-data-center-gpus-explained-a100-h200-b200-and-beyond)
- [AMD Data Center GPUs Explained: MI250X, MI300X, MI350X and Beyond](https://www.bentoml.com/blog/amd-data-center-gpus-mi250x-mi300x-mi350x-and-beyond)

## Matching GPUs to open-source LLMs

Different models perform best on different types of GPUs. The table below maps popular NVIDIA and AMD GPUs to suitable open-source LLMs. Some models require **multiple GPUs to meet VRAM demands** or you may need optimization techniques like [quantization](./llm-quantization). 

| **GPU** | **VRAM** | **Memory Bandwidth** | **Example LLMs** | **Notes** |
| --- | --- | --- | --- | --- |
| **NVIDIA T4** | 16 GB | 320 GB/s | Llama-2-7B (4-bit quantized) | Entry-level graphic card; cost-effective inference for small models (&lt;10GB) |
| **NVIDIA L4** | 24 GB | 300 GB/s | Llama-3-8B, Gemma-3-4B, Qwen2.5-7B, Ministral-8B-Instruct-2410 | Cost-efficient mid-range GPU; widely available in cloud |
| **AMD MI250** | 128 GB | 3.2 TB/s | Llama-3.1-8B, Qwen2.5-7B, Phi-3-medium-4k-instruct, gemma-7b-it | Strong memory bandwidth; solid AMD mid-tier option |
| **NVIDIA A100** | 40/80 GB | 1.6–2.0 TB/s | Phi-3-medium-4k-instruct, Gemma-3-12B/27B, gpt-oss-20b, gpt-oss-120b, AI21-Jamba-Mini-1.5, Llama-3.3-70B, Qwen2.5-VL | Workhorse for medium to large models (>10GB) and complex computer vision tasks |
| **NVIDIA H100** | 80 GB | 3.35 TB/s | Llama-3.3-70B, Llama-4-Scout, Llama 4 Maverick, gpt-oss-120b, DeepSeek-R1-Distill-Llama-70B, Qwen3-Next-80B-A3B-Instruct, GLM-4.5V | Optimized for transformer inference; excellent throughput at scale |
| **NVIDIA H200** | 141 GB | 4.8 TB/s | DeepSeek-R1-0528, DeepSeek-V3.1-Terminus, DeepSeek-Prover-V2-671B, Qwen3-Coder-480B-A35B-Instruct | Large memory capacity; designed for next-gen LLMs |
| **AMD MI300X** | 192 GB | 5.3 TB/s | gpt-oss-120b, Llama-3.3-70B, Llama-3.1-405B, DeepSeek-R1-0528, DeepSeek-V3.1-Terminus | High memory capacity; strong choice for large models |
| **AMD MI325X** | 256 GB | 6.0 TB/s | gpt-oss-120b, Llama 3.3-70B, Llama-3.1-405B, DeepSeek-R1-0528, DeepSeek-V3.1-Terminus | 3rd Gen CDNA architecture; built for massive multi-GPU clusters |

:::note
Use this table only as a reference. For production deployments, always benchmark your own models against the hardware.
:::

Things to keep in mind:

- **FP8 support**. If you choose NVIDIA GPUs, note that LLMs that rely on native FP8 weights can only run on NVIDIA H-series (or newer) GPUs. This is because A-series cards lack FP8 hardware support.
- **Single vs. Multi-GPU**. Some models can run on one card, but usually performance improves with multiple GPUs (e.g., for high-concurrency scenarios).
- **Hardware flexibility**. Most models can run on different hardware. For instance, gpt-oss-20b and gpt-oss-120b can run on NVIDIA A100, H100, H200, B200 GPUs, or AMD MI300X, MI325X, MI355X GPUs. The limiting factor is usually VRAM and cluster size, not architecture. Learn how to [calculate GPU memory for serving LLMs](./calculating-gpu-memory-for-llms).

---

At [Bento](https://www.bentoml.com/), we work to help enterprises self-host any open and custom LLMs on either NVIDIA or AMD GPUs with the best availability and rates. Let us know if you need custom GPU solutions for your use case.

<div style={{ margin: '3rem 0' }}>
[<Button>Talk to us</Button>](https://l.bentoml.com/contact-us-llm-inference-handbook)
</div>

## FAQs

### What is the best GPU comparison tool for AI workloads?

Most generic GPU comparison tools focus on gaming or graphics performance, which doesn’t reflect real AI inference workloads. For LLMs, you need tools that measure [throughput and latency metrics like TTFT and ITL](../inference-optimization/llm-inference-metrics).

You can start by checking open-source leaderboards from frameworks such as vLLM, SGLang, and TensorRT-LLM. They provide ready-to-use scripts that help you compare inference performance across different GPUs.

However, these frameworks usually require manual configuration and tuning, which can be time-consuming.

A faster option is [llm-optimizer](https://www.bentoml.com/blog/announcing-llm-optimizer), an open-source tool for benchmarking and optimizing LLM inference. It works across multiple inference frameworks and supports any open-source LLM. It lets you define constraints such as *“TTFT under 200ms”* or *“P99 ITL below 10ms.”* This helps you quickly find the optimal configurations that meet your performance goals.

### Where can I buy or rent GPU servers?

You can either buy on-premises GPU servers or rent cloud GPUs depending on your scale, control needs, and budget.

Cloud providers such as AWS, Google Cloud and Azure let you rent H100, H200 or MI300X GPUs on demand.

NeoClouds like CoreWeave and Nebius provide lower-cost access and flexible billing. However, they typically offer less control and fewer compliance guarantees for regulated or enterprise environments.

If you prefer full ownership, you can purchase GPU servers outright from original equipment (OE) partners like Dell, GIGABYTE, or HPE, which work directly with NVIDIA and AMD. This route gives you maximum control, but also means higher upfront costs and longer procurement cycles.

For details, read the [2026 GPU Procurement Guide](https://www.bentoml.com/blog/where-to-buy-or-rent-gpus-for-llm-inference).

### How can I check what GPU I have?

On most systems, you can quickly verify your GPU type using command-line tools:

- **Linux**: `nvidia-smi` (for NVIDIA) or `amd-smi` (for AMD).
- **macOS**: `system_profiler SPDisplaysDataType`.
- **Windows**: Open **Device Manager** → **Display Adapters**.

### How important are CUDA and driver versions when choosing a GPU?

Very important. GPU performance isn’t just about the hardware. Your NVIDIA driver, CUDA version, and framework build (e.g., PyTorch, vLLM, SGLang, TensorRT-LLM) all need to line up. When they don’t, you’ll see errors, slowdowns, or missing features like FP8 or [FlashAttention](../inference-optimization/flashattention).

For NVIDIA GPUs:

- **Driver** contains the [CUDA Driver API](https://docs.nvidia.com/cuda/cuda-driver-api/index.html) and talks directly to the GPU
- **CUDA toolkit** provides development tools, compilers and libraries
- **cuDNN, cuBLAS and NCCL** power operations inside PyTorch and most inference engines
- **Framework builds** are compiled for a specific CUDA toolkit version

If any part of the stack is outdated, you might hit issues like:

- “CUDA driver version is insufficient”
- Kernel failures
- Poor throughput
- Missing FP8, FlashAttention, or device-level optimizations

A simple rule of thumb:

- Your **driver's CUDA version** must be ≥ the **CUDA toolkit version** your framework was built with.
- Newer drivers are usually backwards compatible with older CUDA toolkits.
- Older drivers can’t run newer CUDA runtimes.

You can confirm your driver and GPU with:

```bash
nvidia-smi

# Example output:
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.129.03             Driver Version: 535.129.03   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
```

This means your driver supports up to CUDA 12.2 runtime. Your framework can be built with CUDA 12.2, 12.1, 11.8, etc., but not 12.3 or newer.

To upgrade, download the official [CUDA toolkit](https://developer.nvidia.com/cuda-downloads) and [driver](https://www.nvidia.com/en-us/drivers/) packages.

<LinkList>
  ## Additional resources
  * [NVIDIA Data Center GPUs Explained: From A100 to B200 and Beyond](https://www.bentoml.com/blog/nvidia-data-center-gpus-explained-a100-h200-b200-and-beyond)
  * [AMD Data Center GPUs Explained: MI250X, MI300X, MI350X and Beyond](https://www.bentoml.com/blog/amd-data-center-gpus-mi250x-mi300x-mi350x-and-beyond)
  * [How to Beat the GPU CAP Theorem in AI Inference](https://www.bentoml.com/blog/how-to-beat-the-gpu-cap-theorem-in-ai-inference)
  * [What is GPU Memory and Why it Matters for LLM Inference](https://www.bentoml.com/blog/what-is-gpu-memory-and-why-it-matters-for-llm-inference)
</LinkList>