---
sidebar_position: 5
---

# Choosing the right inference framework

Once you’ve selected a model, the next step is choosing how to run it. Your choice of inference framework directly affects latency, throughput, hardware efficiency, and feature support. There's no one-size-fits-all solution. Your decision depends on your deployment scenario, use case, and infrastructure.

## Inference frameworks

If you're building high-throughput, low-latency applications, such as chatbots and RAG pipelines, these frameworks are optimized for running LLM inference:

- [vLLM](https://github.com/vllm-project/vllm). A high-performance inference engine optimized for serving LLMs. It is known for its efficient use of GPU resources and fast decoding capabilities.
- [SGLang](https://github.com/sgl-project/sglang). A fast serving framework for LLMs and vision language models. It makes your interaction with models faster and more controllable by co-designing the backend runtime and frontend language.
- [LMDeploy](https://github.com/InternLM/lmdeploy). An inference backend focusing on delivering high decoding speed and efficient handling of concurrent requests. It supports various quantization techniques, making it suitable for deploying large models with reduced memory requirements.
- [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM). An inference backend that leverages NVIDIA's TensorRT, a high-performance deep learning inference library. It is optimized for running large models on NVIDIA GPUs, providing fast inference and support for advanced optimizations like quantization.
- [Hugging Face TGI](https://github.com/huggingface/text-generation-inference). A toolkit for deploying and serving LLMs. It is used in production at Hugging Face to power Hugging Chat, the Inference API and Inference Endpoint.

If you're working with limited hardware or targeting desktop/edge devices, these tools are optimized for low-resource environments:

- [llama.cpp](https://github.com/ggml-org/llama.cpp). A lightweight inference runtime for LLMs, implemented in plain C/C++ with no external dependencies. Its primary goal is to make LLM inference fast, portable, and easy to run across a wide range of hardware. Despite the name, llama.cpp supports far more than just Llama models. It supports many popular architectures like Qwen, DeepSeek, and Mistral. The tool is ideal in low-latency inference and performs well on consumer-grade GPUs.
- [MLC-LLM](https://github.com/mlc-ai/mlc-llm). An ML compiler and high-performance deployment engine for LLMs. It is built on top of Apache TVM and requires compilation and weight conversion before serving models. MLC-LLM can be used for a wide range of hardware platforms, supporting AMD, NVIDIA, Apple, and Intel GPUs across Linux, Windows, macOS, iOS, Android, and web browsers.
- [Ollama](https://ollama.com/). A user-friendly local inference tool built on top of llama.cpp. It’s designed for simplicity and ease of use, ideal for running models on your laptop with minimal setup. However, Ollama is mainly used for single-request use cases. Unlike runtimes like vLLM or SGLang, it doesn’t support concurrent requests. This difference matters since many inference optimizations, such as paged attention, KV caching, and dynamic batching, are only effective when handling multiple requests in parallel.

## Why you might need multiple inference runtimes?

In real-world deployments, no single runtime is perfect for every scenario. Here’s why AI teams often end up using more than one:

### Different use cases have different needs

Models, hardware, and workloads vary. The best performance often comes from matching each use case with a runtime tailored to that environment.

- **High-throughput, batching**: vLLM, SGLang, LMDeploy, TensorRT-LLM (tuning needed for better performance)
- **Edge/mobile deployment**: MLC-LLM, llama.cpp
- **Local experimentation or single-user scenario**: Ollama and llama.cpp

### Toolchains and frameworks evolve fast

Inference runtimes are constantly updated. The best tool today may be missing features next month. Additionally, some models are only optimized (or supported) in specific runtimes at launch.

To stay flexible, your infrastructure should be runtime-agnostic. This lets you combine the best of each tool without getting locked into a single stack.