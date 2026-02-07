from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import base64
from severity import compute_severity

app = FastAPI()

# 1. Allow Next.js (localhost:3000) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to your frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load Model ONCE when server starts (Efficient)
MODEL_PATH = "best.pt" 
try:
    model = YOLO(MODEL_PATH)
    print("✅ YOLO Model Loaded Successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")

@app.get("/")
def home():
    return {"status": "ML Service is running"}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    # A. Read Image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return {"error": "Invalid image"}

    # B. Run YOLO Inference
    results = model(image)[0]
    
    # C. Extract Data for Severity
    detections = []
    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        area = (x2 - x1) * (y2 - y1)
        detections.append({
            "bbox": [x1, y1, x2, y2],
            "area": area,
            "confidence": float(box.conf[0])
        })

    # D. Compute Severity
    analysis = compute_severity(detections, results.orig_shape)

    # E. Generate Annotated Image (with boxes drawn)
    annotated_frame = results.plot() # Ultralytics method to draw boxes
    
    # F. Convert Annotated Image to Base64 (to send back to frontend)
    _, buffer = cv2.imencode('.jpg', annotated_frame)
    img_base64 = base64.b64encode(buffer).decode('utf-8')

    return {
        "analysis": analysis,
        "annotated_image": f"data:image/jpeg;base64,{img_base64}"
    }

# To run: uvicorn main:app --reload --port 8000