# Phase 9 Concepts: Exact Pixel Sorting (The Obamify Algorithm)

In Phase 9, we moved away from Neural Networks and Patch Mosaics entirely, and implemented a generalized version of Spu7Nix's famous "Obamify" algorithm.

## The Problem: How do we use 100% of the style palette?
In Neural Style Transfer, the AI constantly blends and creates new colors. In Patch Mosaics, the KD-Tree often reuses the same puzzle piece hundreds of times, meaning most of the original painting is never seen.

You wanted a method that takes the **Exact Pixels** of one image (Icarus) and perfectly rearranges them to form the shape of another image (Conor).

## Concept 1: 1-to-1 Pixel Sorting (Exact Histogram Specification)
This is an incredibly fast, pure-math algorithm that runs instantly on a CPU. 

Here is how the mathematics work:
1. **Equalization:** Both the Target (Conor) and Source (Icarus) images are resized to have the exact same number of pixels (e.g., 160,000 pixels).
2. **Flattening:** The 2D images are mathematically unrolled into a single, straight 1D line of 160,000 pixels.
3. **Luminance Extraction:** Using color science (`0.299*R + 0.587*G + 0.114*B`), every pixel is scored on how bright or dark it is.

## Concept 2: Ranking and Assignment
4. **Sort the Source:** The actual colored pixels from Icarus are sorted from Darkest to Brightest.
5. **Rank the Target:** The *coordinates* of Conor McGregor's face are ranked from Darkest to Brightest.
6. **The 1-to-1 Mapping:** The algorithm pairs the lists together. It takes the #1 Darkest colored pixel from Icarus, and glues it onto the #1 Darkest coordinate of Conor's face. 

**The Mathematical Guarantee:**
Because every single pixel from Icarus is used exactly once, the final image is mathematically guaranteed to have the exact same color distribution (the exact same amount of blues, whites, and oranges) as the original Icarus painting. 

But because those colored pixels are placed exactly where Conor's shadows and highlights are, the structure of Conor McGregor's face is flawlessly reconstructed out of the Icarus color palette!
