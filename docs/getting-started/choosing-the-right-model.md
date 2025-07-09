---
sidebar_position: 1
description: Select the right models for your use case.
keywords:
    - LLMs
    - Base models
    - Instruction-tuned models
    - Mixture of Experts models
    - Model composition
---

import LinkList from '@site/src/components/LinkList';

# Choosing the right model

The first step is deciding what type of model fits your use case. Here’s a breakdown of common model types when it comes to LLMs.

## Base models

Base models, also called foundation models, are the starting point of most LLMs. They are typically trained on a massive corpus of text data through unsupervised learning, which does not require labeled data.

During this initial phase, known as pretraining, the model learns general language patterns, such as grammar, syntax, semantics, and context. It becomes capable of predicting the next word (or token) and can perform simple few-shot learning (handling a task after seeing just a few examples). However, it does not yet understand how to follow instructions and is not optimized for specific tasks out of the box.

To make them useful, they typically undergo fine-tuning on curated datasets, using techniques like instruction fine-tuning.

## Instruction-tuned models

Instruction-tuned models are built on top of base models. After the initial pretraining phase, these models go through a second training stage using datasets made up of instructions and their corresponding responses.

This process teaches the models how to follow user prompts more reliably, so that they are better aligned with human expectations. They understand task intent and respond more coherently to commands like:

- “Summarize this article.”
- “Explain how LLM inference works.”
- “List pros and cons of remote work.”

This makes them more practical for real-world applications like chatbots, virtual assistants, and AI tools that interact with users directly.

## Mixture of Experts models

Mixture of Experts (MoE) models, such as [DeepSeek-V3](https://www.bentoml.com/blog/the-complete-guide-to-deepseek-models-from-v3-to-r1-and-beyond), take a different approach from traditional dense models. Instead of using all model parameters for every input, they contain multiple specialized sub-networks called **experts**, each focus on different types of data or tasks.

During inference, only a subset of these experts is activated based on the characteristics of the input. This selection mechanism enables the model to route computation more selectively—engaging different experts depending on the content or context. As a result, MoE models achieve greater scalability and efficiency by distributing workload across a large network while keeping per-inference compute costs manageable.

## Combining LLMs with other models

A modern AI application rarely uses just a single LLM. Many advanced systems rely on composing LLMs with other types of models, each specialized for a different modality or task. This allows them to go beyond plain text generation and become more capable, multimodal, and task-aware.

Here are common examples:

- **Small Language Models (SLMs)**. Used for lightweight tasks where latency and resource constraints matter. They can serve as fallback models or on-device assistants that handle basic interactions without relying on a full LLM.
- **Embedding models**. They transform inputs (e.g., text, images) into vector representations, making them useful for semantic search, RAG pipelines, recommendation systems, and clustering.
- **Image generation models**. Models like Stable Diffusion generate images from text prompts. When paired with LLMs, they can support more advanced text-to-image workflows such as creative assistants, content generators, or multimodal agents.
- **Vision language models (VLMs)**. Models such as NVLM 1.0 and Qwen2.5-VL combine visual and textual understanding, supporting tasks like image captioning, visual Q&A, or reasoning over screenshots and diagrams.
- **Text-to-speech (TTS) models**. They can convert text into natural-sounding speech. When integrated with LLMs, they can be used in voice-based agents, accessible interfaces, or immersive experiences.

<LinkList>
  ## Additional resources
  * [Model composition](https://docs.bentoml.com/en/latest/get-started/model-composition.html)
  * [The Complete Guide to DeepSeek Models: From V3 to R1 and Beyond](https://www.bentoml.com/blog/the-complete-guide-to-deepseek-models-from-v3-to-r1-and-beyond)
  * [A Guide to Open-Source Image Generation Models](https://www.bentoml.com/blog/a-guide-to-open-source-image-generation-models)
  * [A Guide to Open-Source Embedding Models](https://www.bentoml.com/blog/a-guide-to-open-source-embedding-models)
  * [Multimodal AI: A Guide to Open-Source Vision Language Models](https://www.bentoml.com/blog/multimodal-ai-a-guide-to-open-source-vision-language-models)
  * [Exploring the World of Open-Source Text-to-Speech Models](https://www.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models)
</LinkList>