---
sidebar_position: 1
---

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