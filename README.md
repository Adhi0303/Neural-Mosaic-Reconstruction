<div align="center">
  <br />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" alt="PyTorch" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/OpenAI_CLIP-412991?style=for-the-badge&logo=openai&logoColor=white" alt="CLIP" />
  <br />

  <h1>🎨 Neural Mosaic Reconstruction (The Atelier)</h1>
  
  <p>
    An AI-powered computational art engine that reconstructs a subject portrait using the visual language, color distribution, or geometric fragments of a style reference image. 
  </p>

  <p>
    <a href="#overview">Overview</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#core-engines">Core Engines</a> •
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🌟 Overview

Standard image editing and filter tools apply simple pixel overlays or color transformations without a mathematical understanding of facial structure or artistic composition. Traditional Neural Style Transfer (NST) can generate beautiful images, but it is extremely computationally intensive and prone to messy artifacts. 

**The Atelier** bridges deep feature representation and computational geometry. It offers four distinct mathematical and neural reconstruction engines that balance artistic fidelity, structural preservation, and raw generation speed, allowing you to recreate any portrait in the exact style and medium of another image.

---

## ⚙️ How It Works

The Atelier operates through a streamlined Client-Server pipeline, executing advanced visual algorithms on demand:

1. **Upload & Analyze:** You upload a target Subject image and a Style Reference image.
2. **Zero-Shot Naming:** The backend immediately runs both images through a lazy-loaded **OpenAI CLIP (Vision-Language) Model**. It classifies the subject and the stylistic "world," automatically generating a poetic title for the artwork (e.g., *"Study of [Subject] in the Manner of [World]"*).
3. **Engine Selection:** You choose one of four distinct reconstruction engines (Neural, Mosaic, Pixel Sorter, or Block Sorter).
4. **Mathematical Reconstruction:** The backend extracts deep convolutional features (VGG19) or geometric patches, optimizing the image matrix to combine the subject's structure with the reference's texture/colors.
5. **Real-Time Rendering:** The React UI displays the generated artwork alongside its AI-generated title in a premium museum gallery dashboard.

---

## 🏗️ Architecture

The project is structured as a full-stack application, cleanly separating the React exhibition interface from the intensive PyTorch computational backend.

```mermaid
graph TD
    subgraph Frontend [React Frontend - Vite/TS]
        UI[Atelier UI - index.tsx] -->|/generate POST| API_GEN[FastAPI Endpoint]
        UI -->|/name POST| API_NAME[FastAPI Endpoint]
        Styles[styles.css] --> UI
    end

    subgraph Backend [Python Backend - FastAPI/PyTorch]
        API_GEN --> Router{Engine Selector}
        API_NAME --> CLIP[CLIP Title Generator]
        
        Router -->|neural| NST[Neural Style Transfer Engine]
        Router -->|mosaic| Mosaic[Patch-Based Mosaic Engine]
        Router -->|pixel_sorter| PS[Exact Pixel Sorter]
        Router -->|block_sorter| BS[1-to-1 Block Sorter]
        
        NST --> VGG[VGG19 Feature Extractor]
        NST --> LBFGS[L-BFGS Optimizer]
        
        Mosaic --> KDTree[SciPy KD-Tree Index]
        
        PS --> LumPS[Luminance Matching]
        BS --> LumBS[Block Luminance Matching]
    end
    
    style Backend fill:#1e1e1e,stroke:#fff,color:#fff
    style Frontend fill:#2d3748,stroke:#fff,color:#fff
```

---

## 🧠 Core Reconstruction Engines

The system features four distinct algorithms for image synthesis:

### 1. Neural Style Transfer (NST)
Uses a pretrained **VGG19** network to separate content and style. It optimizes the pixel intensities of a canvas using an **L-BFGS optimizer** to minimize Content Loss (at layer `conv4_2`) and Style Loss (average MSE of Gram Matrices across 5 layers).

### 2. Patch-Based Mosaic Engine
A non-neural, math-driven engine. It extracts thousands of overlapping square patches (e.g., 20x20) from the style image, converting them to grayscale signatures. It indexes them using a spatial **SciPy KD-Tree**, and swaps target image blocks with their nearest style neighbor based on grayscale structure.

### 3. Exact Pixel Sorter 
Rearranges 100% of the individual pixels of the style image to match the structure of the target image. It maps style pixels sorted by brightness 1-to-1 onto the target's luminance coordinates, guaranteeing an identical color histogram to the style reference.

### 4. 1-to-1 Block Sorter
Solves the "pixelated" limitation of pixel sorting. It chops both source and target images into non-overlapping blocks, calculating average luminance. It maps the blocks 1-to-1, perfectly preserving local color clusters and textures.

---

## 🛠️ Technology Stack

### Backend (Deep Learning & APIs)
- **Languages:** Python 3.x
- **Deep Learning:** PyTorch, TorchVision (VGG19)
- **Vision-Language (NLP):** Hugging Face Transformers (`openai/clip-vit-base-patch32`)
- **Scientific Computing:** NumPy, SciPy (`scipy.spatial.KDTree`)
- **Web Framework:** FastAPI, Uvicorn

### Frontend (UI & Exhibition)
- **Framework:** React 19, TypeScript, Vite
- **Routing:** TanStack Router
- **Styling:** TailwindCSS v4, Custom CSS (OKLAB color-mix, canvas noise shaders)
- **Components:** Radix UI Primitives, Lucide React Icons

---

<div align="center">
  <p>Where Computational Geometry meets Artistic Expression.</p>
</div>
