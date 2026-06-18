# Phase 8 Concepts: Patch-Based Mosaic Reconstruction

In Phase 8, we abandoned Neural Networks completely. Because deep learning (Calculus on VGG19) was too slow on a CPU, we turned to pure Data Science and Mathematical Indexing to build our art.

## Concept 1: The Puzzle Piece Extraction
Instead of analyzing brush strokes, we physically chopped the Style Image (Icarus) into thousands of tiny squares (e.g., 20x20 pixel patches). We used a "Sliding Window" algorithm to slide across the image, ripping out overlapping chunks to build a massive library of puzzle pieces.

## Concept 2: The KD-Tree (The Librarian)
If we have 150,000 puzzle pieces, how do we quickly find the one piece that perfectly matches a section of Conor's face? Scanning them one by one would take forever.

We used a **KD-Tree** (K-Dimensional Tree) from `scipy`. A KD-Tree is a mathematical data structure that acts like a super-librarian. By sorting the puzzle pieces into a multi-dimensional tree map, the algorithm can find the "Nearest Neighbor" (the closest matching piece) in a fraction of a millisecond!

## Concept 3: Luminance Matching (The Rubik's Cube Method)
Our first attempt at the mosaic failed because the KD-Tree matched pieces by **RGB Color**. Because Conor's photo was dark black, the algorithm only selected the dark black corners of the Icarus painting, completely ignoring the beautiful blues and oranges.

We solved this with **Structural Shade Matching**:
1. We converted both images into Grayscale (Black & White).
2. We asked the KD-Tree to search the Grayscale images to find puzzle pieces that matched the **Depth, Shadows, and Highlights** of Conor's face (completely ignoring the color).
3. Once the matching structural piece was found, we glued the **Original Full-Color RGB** Icarus piece onto the canvas.

This is exactly how artists build portraits out of Rubik's Cubes: they use dark blue or dark green cubes for the shadows of a face, and bright orange cubes for the highlights!
