---
sidebar_position: 4
---

import Features from '@site/src/components/Features';
import LinkList from '@site/src/components/LinkList';
import Button from '@site/src/components/Button';

# Where is LLM inference run?

When deploying LLMs into production, choosing the right hardware is crucial. Different hardware types offer varied levels of performance and cost-efficiency. The three primary options are CPUs, GPUs, and TPUs. Understanding their strengths and weaknesses helps you optimize your inference workloads effectively.

## CPUs

Central Processing Units (CPUs) are general-purpose processors used in all computers and servers. CPUs are widely available and suitable for running small models or serving infrequent requests. However, they lack the parallel processing power to run LLMs efficiently. For production-grade LLM inference, especially with larger models or high request volumes, CPUs often fall short in both latency and throughput.

## GPUs

Graphics Processing Units (GPUs) were originally designed for graphics rendering and digital visualization tasks. As they could perform highly parallel operations, they also turned out to be a great fit for ML and AI workloads. Today, GPUs are the default choice for both training and inference of GenAI like LLMs.

The architecture of GPUs is optimized for matrix multiplication and tensor operations, which are core components of transformer-based models. Modern inference frameworks and runtimes (e.g., vLLM, SGLang, LMDeploy, TensorRT-LLM, and Hugging Face TGI) are designed to take full advantage of GPU acceleration.

## TPUs

Tensor Processing Units (TPUs) are custom-built by Google to accelerate AI workloads like training and inference. Compared with GPUs, TPUs are designed from the ground up for tensor operations — the fundamental math behind neural networks. This specialization makes TPUs faster and more efficient than GPUs for many AI-based compute tasks, like LLM inference.

TPUs are behind some of the most advanced AI applications today: agents, recommendation systems and personalization, image, video & audio synthesis, and more. Google uses TPUs in Search, Photos, Maps, and to power Gemini and DeepMind models.

## Choosing the right hardware for your LLM inference

Selecting the appropriate hardware requires you to understand your model size, inference volume, latency requirements, cost constraints, and available infrastructure. GPUs remain the most popular choice due to their versatility and broad support, while TPUs offer compelling advantages for certain specialized scenarios, and CPUs still have a place for lightweight, budget-conscious workloads.