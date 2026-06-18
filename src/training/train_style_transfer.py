import sys
import os
import torch
import argparse
from data.image_loader import load_image, tensor_to_image
from models.neural_style_transfer import StyleTransferEngine

def main():
    parser = argparse.ArgumentParser(description="Run Neural Style Transfer")
    parser.add_argument("--content", type=str, default="data/content_images/mcgregor.jpg", help="Path to content image")
    parser.add_argument("--style", type=str, default="data/style_images/icarus.jpg", help="Path to style image")
    parser.add_argument("--output", type=str, default="outputs/final_masterpiece.jpg", help="Path to save output image")
    parser.add_argument("--steps", type=int, default=300, help="Number of optimization steps")
    parser.add_argument("--style_weight", type=float, default=1000000.0, help="Weight for style loss")
    parser.add_argument("--content_weight", type=float, default=1.0, help="Weight for content loss")
    args = parser.parse_args()

    # 1. Setup
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    engine = StyleTransferEngine(device)

    # 2. Load images
    print(f"Loading Content Image: {args.content}")
    content_img = load_image(args.content, max_size=400)
    if content_img is None:
        return
    content_img = content_img.to(device)

    print(f"Loading Style Image: {args.style}")
    style_img = load_image(args.style, max_size=400)
    if style_img is None:
        return
    style_img = style_img.to(device)

    # 3. Run NST
    print(f"Starting Style Transfer for {args.steps} steps...")
    final_tensor = engine.run(
        content_img=content_img,
        style_img=style_img,
        num_steps=args.steps,
        style_weight=args.style_weight,
        content_weight=args.content_weight
    )

    # 4. Save output
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    final_image = tensor_to_image(final_tensor)
    final_image.save(args.output)
    print(f"Success! Masterpiece saved to {args.output}")

if __name__ == "__main__":
    main()
