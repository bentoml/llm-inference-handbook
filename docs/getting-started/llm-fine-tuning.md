---
sidebar_position: 3
---

# LLM fine-tuning

Fine-tuning is one of the most effective ways to adapt an LLM for a specific use case. It continues the training process on a pre-trained model using new, task-specific data. This can involve updating the entire model or just specific layers.

A key driver behind fine-tuning is efficiency. Instead of training a model from scratch (which is extremely resource-intensive), it's far easier and more cost-effective to build on top of a base model that has already learned general language patterns from massive datasets. Fine-tuning sharpens those broad capabilities for your particular task.

For example, fine-tuning can significantly improve a model’s:

- **Domain expertise**: Adapting a model for legal, medical, or programming-related tasks.
- **Instruction following**: Ensuring the model adheres to specific formats, tones, or styles in its responses.
- **Safety and alignment**: Reinforcing how the model handles sensitive or high-risk prompts.

## Common fine-tuning Frameworks

Fine-tuning LLMs doesn’t have to mean building everything from the ground up. Several open-source frameworks are designed to streamline the process.

These tools provide out-of-the-box support for training open-weight models on custom datasets. They make it easier to apply modern optimization techniques without having to write complex training code yourself.

Many of these frameworks are also built with efficiency in mind, helping users reduce memory usage and speed up training, even on limited hardware.

### Axolotl

[Axolotl](https://axolotl.ai/) is a user-friendly fine-tuning framework to simplify post-training for LLMs. Whether you’re doing full fine-tuning, instruction tuning, LoRA/QLoRA, or alignment work, Axolotl makes it easy to get started, without diving deep into training internals.

It’s built on top of Hugging Face’s Transformers library but wraps much of the complexity in a clean, YAML-based configuration system. You define your training setup like datasets, models, and training strategy in a single config file. Axolotl takes care of the rest.

Key features:

- Supports popular open-weight models like Llama, Pythia, Falcon, and MPT.
- Flexible training options: full fine-tuning, LoRA, QLoRA, ReLoRA, and GPTQ.
- Compatible with advanced techniques like xFormers, Flash Attention, ROPE scaling, Liger kernel, and sample packing.
- Scales from single GPU setups to multi-GPU training using FSDP or DeepSpeed.
- Easy to run locally with Docker or on cloud infrastructure.

Axolotl is great for users who want to focus on their data and tasks instead of the details of deep learning internals. With sensible defaults, strong community support, and lots of integrations, it's a go-to choice for practical fine-tuning of open models.

### Unsloth

[Unsloth](https://unsloth.ai/) is a fine-tuning framework designed to make training LLMs faster, lighter, and more accessible, especially on limited hardware (e.g., free Google Colab GPUs).

Unsloth is deeply optimized at the kernel level. Built with a custom attention implementation in [Triton](https://openai.com/index/triton), it enables 2× faster training with up to 80% less memory usage.

The Unsloth team has collaborated directly with developers behind models like Llama 4, Mistral, Qwen, Gemma, and Phi, often contributing bug fixes and updates that improve prompt handling, accuracy, and overall stability.

Key features:

- Supports fine-tuning open-weight models like Llama, Mistral, Phi, Gemma, and more.
- Supports LoRA, QLoRA, full fine-tuning, and even reinforcement learning (DPO, ORPO).
- Highly customizable: edit chat templates, dataset formats, and training configs as needed.
- Compatible with inference tools like Ollama, llama.cpp, and vLLM.
- Runs easily on platforms like Google Colab, Kaggle, and even older consumer GPUs.

If you're trying to fine-tune a model on resource-constrained setups, Unsloth is a top choice. It’s built to maximize what you can do with minimal resources.

### Torchtune

[Torchtune](https://github.com/pytorch/torchtune) is a PyTorch-native library for fine-tuning LLMs. It's built for users who want full control over the training pipeline without relying on high-level abstractions or opaque training frameworks.

Torchtune follows PyTorch’s core principles: usability over everything else. It avoids unnecessary abstractions and emphasizes:

- Native PyTorch components
- Composition over inheritance
- Clear training logic instead of hidden framework mechanics
- Test-driven development and correctness at every level

Key features:

- Modular LLM implementations written in pure PyTorch.
- Training recipes for a variety of fine-tuning techniques like full fine-tuning, LoRA, and QLoRA.
- Easy configuration with YAML files to manage datasets, models, hyperparameters, and hardware settings.
- Interoperability with model zoos through checkpoint conversion tools.

Torchtune is ideal if you prefer working directly in PyTorch and want to customize everything, from data preprocessing to training logic. It’s especially useful for researchers, developers, and engineers who value transparent code, reproducibility, and direct access to model internals.

### LLaMA Factory

[LLaMA Factory](https://github.com/hiyouga/LLaMA-Factory) is an open-source fine-tuning toolkit built for simplicity and efficiency. It supports more than 100 LLMs, with both a command-line interface and a Web UI for zero-code workflows.

Unlike many frameworks that target expert users, LLaMA Factory is designed to be beginner-friendly. Through its web interface, users can select a model, upload a dataset, adjust a few parameters, and launch training, with no coding required.

But it’s not just for beginners. Behind the scenes, LLaMA Factory supports a wide range of tuning methods, making it equally useful for experienced researchers and developers.

Key features:

- Fine-tuning methods: supervised SFT (including multimodal), reward modeling, and reinforcement learning (PPO, DPO, ORPO, KTO).
- Quantization and adapter support: 16-bit full-tuning, freeze-tuning, LoRA, and 2–8 bit QLoRA via formats like GPTQ, AWQ, HQQ, and AQLM.
- Advanced optimization: GaLore, DoRA, LongLoRA, LoftQ, LLaMA Pro, Mixture-of-Depths, and more.