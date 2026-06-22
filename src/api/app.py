import os
import io
import uuid
import random
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from PIL import Image
import torch
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.mosaic_engine import MosaicEngine
from models.pixel_sorter import PixelSorterEngine
from models.block_sorter import BlockSorterEngine
from models.neural_style_transfer import StyleTransferEngine
from data.image_loader import load_image, tensor_to_image

# --- CLIP setup (lazy-loaded on first /name call) ---
_clip_model = None
_clip_processor = None

def get_clip():
    global _clip_model, _clip_processor
    if _clip_model is None:
        from transformers import CLIPProcessor, CLIPModel
        _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        _clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        _clip_model.eval()
    return _clip_model, _clip_processor

SUBJECT_LABELS = [
    "a portrait of a man",
    "a portrait of a woman",
    "a portrait of a warrior",
    "a portrait of a nobleman",
    "a portrait of a scholar",
    "a portrait of a young person",
    "a portrait of an elderly person",
    "a figure standing in shadow",
    "a face seen in profile",
    "a portrait of an athlete",
]

WORLD_LABELS = [
    "a landscape painting",
    "an abstract painting",
    "a painting of flowers and nature",
    "a painting of the sky and clouds",
    "a battle scene painting",
    "a mythological scene painting",
    "a seascape painting",
    "a dark forest painting",
    "a painting suffused with golden light",
    "a starry night painting",
    "a Renaissance oil painting",
    "an impressionist painting",
]

TEMPLATES = [
    "Study of {subject} in the Manner of {world}",
    "{subject}, Dissolved into {world}",
    "Portrait After {world} — The {subject} Remaining",
    "{subject} Surrendered to {world}",
    "Composition: {subject} Translated Upon {world}",
    "{subject} — A Fragment of {world}",
    "The {subject}, Reimagined as {world}",
    "{subject} in the Light of {world}",
]

def classify_image(pil_image, labels):
    model, processor = get_clip()
    inputs = processor(text=labels, images=pil_image, return_tensors="pt", padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = outputs.logits_per_image.softmax(dim=1)
    best_idx = probs.argmax().item()
    return labels[best_idx]

def strip_label(label: str) -> str:
    """Remove leading articles for use inside a template."""
    for prefix in ("a portrait of ", "a painting of ", "an ", "a "):
        if label.startswith(prefix):
            return label[len(prefix):].strip()
    return label.strip()

app = FastAPI(title="Neural Mosaic API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "outputs", "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/generate")
def generate_image(
    content_image: UploadFile = File(...),
    style_image: UploadFile = File(...),
    engine: str = Form(...)
):
    try:
        req_id = str(uuid.uuid4())
        content_path = os.path.join(TEMP_DIR, f"content_{req_id}.jpg")
        style_path = os.path.join(TEMP_DIR, f"style_{req_id}.jpg")
        output_path = os.path.join(TEMP_DIR, f"output_{req_id}.jpg")

        with open(content_path, "wb") as f:
            f.write(content_image.file.read())
        with open(style_path, "wb") as f:
            f.write(style_image.file.read())

        if engine == "mosaic":
            mosaic_engine = MosaicEngine(tile_size=5, stride=2)
            final_image = mosaic_engine.run(content_path, style_path, output_size=(400, 400))
        elif engine == "pixel_sorter":
            sorter = PixelSorterEngine()
            final_image = sorter.run(content_path, style_path, output_size=(400, 400))
        elif engine == "block_sorter":
            sorter = BlockSorterEngine(block_size=5)
            final_image = sorter.run(content_path, style_path, output_size=(800, 800))
        elif engine == "neural":
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            neural_engine = StyleTransferEngine(device)
            content_img_tensor = load_image(content_path, max_size=400).to(device)
            style_img_tensor = load_image(style_path, max_size=400).to(device)
            final_tensor = neural_engine.run(content_img_tensor, style_img_tensor, num_steps=200, style_weight=1000000.0, content_weight=1.0)
            final_image = tensor_to_image(final_tensor)
        else:
            raise HTTPException(status_code=400, detail="Unknown engine selected.")

        final_image.save(output_path)
        
        return FileResponse(output_path, media_type="image/jpeg")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/name")
async def name_artwork(
    content_image: UploadFile = File(...),
    style_image: UploadFile = File(...),
):
    try:
        content_bytes = await content_image.read()
        style_bytes = await style_image.read()

        content_pil = Image.open(io.BytesIO(content_bytes)).convert("RGB")
        style_pil = Image.open(io.BytesIO(style_bytes)).convert("RGB")

        subject_label = classify_image(content_pil, SUBJECT_LABELS)
        world_label = classify_image(style_pil, WORLD_LABELS)

        subject = strip_label(subject_label).title()
        world = strip_label(world_label).title()

        template = random.choice(TEMPLATES)
        title = template.format(subject=subject, world=world)

        return JSONResponse({"title": title})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
