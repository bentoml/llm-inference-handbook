---
sidebar_position: 4
description: Learn the differences between CPUs, GPUs, and TPUs and where you can deploy them.
keywords:
    - CPUs, GPUs, TPUs, CPU vs GPU vs TPU
    - Cloud LLM inference, On-prem LLM inference, On-device LLM inference, GPU inference, Edge LLM inference
    - LLM inference hardware
---

import LinkList from '@site/src/components/LinkList';

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

## Choosing the deployment environment

The deployment environment shapes everything from latency and scalability to privacy and cost. Each environment suits different operational needs for enterprises.

- **Cloud**: The cloud is the most popular environment for LLM inference today. It offers on-demand access to high-performance GPUs and TPUs, along with a rich ecosystem of managed services, autoscaling, and monitoring tools.
- **On-Prem**: On-premises deployments means running LLM inference on your own infrastructure, typically within a private data center. It offers full control over data, performance, and compliance, but requires more operational overhead.
- **Edge**: In edge deployments, the model runs directly on user devices or local edge nodes, closer to where data is generated. This reduces network latency and increases data privacy, especially for time-sensitive or offline use cases. Edge inference usually uses smaller, optimized models due to limited compute resources.

More details will be covered in the [infrastructure and management](../infrastructure-and-operations) chapter.

<LinkList>
  ## Additional resources
  * [How to Beat the GPU CAP Theorem in AI Inference](https://www.bentoml.com/blog/how-to-beat-the-gpu-cap-theorem-in-ai-inference)
  * [State of AI Inference Infrastructure Survey Highlights](https://www.bentoml.com/blog/2024-ai-infra-survey-highlights)
</LinkList>