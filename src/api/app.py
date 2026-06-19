import os
import io
import uuid
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.mosaic_engine import MosaicEngine
from models.pixel_sorter import PixelSorterEngine
from models.block_sorter import BlockSorterEngine
from models.neural_style_transfer import StyleTransferEngine
from data.image_loader import load_image, tensor_to_image
import torch

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
