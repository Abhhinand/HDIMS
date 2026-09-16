from typing import Dict, Any, Tuple

def calculate_news2(
    respiration_rate: int,
    spo2: int,
    oxygen_supplement: bool,
    systolic_bp: int,
    pulse_rate: int,
    consciousness: str,
    temperature: float
) -> Tuple[int, str, str, Dict[str, int]]:
    """
    Computes deterministic National Early Warning Score 2 (NEWS2)
    based on Royal College of Physicians UK clinical standard.
    Returns: (total_score, tier, clinical_action, subscores)
    """
    subscores = {}

    # 1. Respiration Rate
    if respiration_rate <= 8:
        subscores["respiration"] = 3
    elif 9 <= respiration_rate <= 11:
        subscores["respiration"] = 1
    elif 12 <= respiration_rate <= 20:
        subscores["respiration"] = 0
    elif 21 <= respiration_rate <= 24:
        subscores["respiration"] = 2
    else:
        subscores["respiration"] = 3

    # 2. SpO2 Oxygen Saturation (Scale 1 standard)
    if spo2 <= 91:
        subscores["spo2"] = 3
    elif 92 <= spo2 <= 93:
        subscores["spo2"] = 2
    elif 94 <= spo2 <= 95:
        subscores["spo2"] = 1
    else:
        subscores["spo2"] = 0

    # 3. Supplemental Oxygen
    subscores["oxygen"] = 2 if oxygen_supplement else 0

    # 4. Systolic Blood Pressure
    if systolic_bp <= 90:
        subscores["systolic_bp"] = 3
    elif 91 <= systolic_bp <= 100:
        subscores["systolic_bp"] = 2
    elif 101 <= systolic_bp <= 110:
        subscores["systolic_bp"] = 1
    elif 111 <= systolic_bp <= 219:
        subscores["systolic_bp"] = 0
    else:
        subscores["systolic_bp"] = 3

    # 5. Pulse / Heart Rate
    if pulse_rate <= 40:
        subscores["pulse"] = 3
    elif 41 <= pulse_rate <= 50:
        subscores["pulse"] = 1
    elif 51 <= pulse_rate <= 90:
        subscores["pulse"] = 0
    elif 91 <= pulse_rate <= 110:
        subscores["pulse"] = 1
    elif 111 <= pulse_rate <= 130:
        subscores["pulse"] = 2
    else:
        subscores["pulse"] = 3

    # 6. Consciousness (ACVPU)
    c_upper = consciousness.upper()
    if c_upper == "ALERT":
        subscores["consciousness"] = 0
    else:
        subscores["consciousness"] = 3

    # 7. Temperature
    if temperature <= 35.0:
        subscores["temperature"] = 3
    elif 35.1 <= temperature <= 36.0:
        subscores["temperature"] = 1
    elif 36.1 <= temperature <= 38.0:
        subscores["temperature"] = 0
    elif 38.1 <= temperature <= 39.0:
        subscores["temperature"] = 1
    else:
        subscores["temperature"] = 2

    total = sum(subscores.values())

    # Risk Tier classification
    if total >= 7 or any(s == 3 for s in subscores.values() if s == 3 and total >= 5):
        tier = "CRITICAL"
        action = "EMERGENCY: Immediate specialist bedside review. Automatic 45-min JIT token pre-provisioning."
    elif 5 <= total <= 6 or any(s == 3 for s in subscores.values()):
        tier = "MEDIUM"
        action = "URGENT ALERT: Ward doctor review within 30 minutes. Continuous telemetry active."
    else:
        tier = "LOW"
        action = "STABLE: Routine 4-6 hourly monitoring. Zero standing access beyond baseline nurse."

    return total, tier, action, subscores
