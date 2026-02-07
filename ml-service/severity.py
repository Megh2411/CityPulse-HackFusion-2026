def compute_severity(detections, image_shape):
    img_h, img_w = image_shape
    image_area = img_h * img_w

    num_potholes = len(detections)
    total_weighted_area = 0
    lane_risk = 0

    for d in detections:
        total_weighted_area += d["area"] * d["confidence"]

        # lane heuristic: bottom half = vehicle path
        y_center = (d["bbox"][1] + d["bbox"][3]) / 2
        if y_center > img_h * 0.5:
            lane_risk += 1

    coverage = total_weighted_area / image_area
    
    # Avoid division by zero
    lane_factor = lane_risk / max(num_potholes, 1)

    # composite risk score
    risk_score = (
        0.5 * coverage +
        0.3 * (num_potholes / 5) +
        0.2 * lane_factor
    )

    if risk_score >= 0.75:
        severity = "critical" # Lowercase to match your frontend enum
    elif risk_score >= 0.5:
        severity = "high"
    elif risk_score >= 0.25:
        severity = "medium"
    else:
        severity = "low"

    return {
        "severity": severity,
        "risk_score": round(risk_score, 2),
        "num_potholes": num_potholes,
        "coverage_ratio": round(coverage, 3),
        "lane_impact_ratio": round(lane_factor, 2)
    }