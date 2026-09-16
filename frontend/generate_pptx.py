import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
import os

def create_hdims_presentation(output_path, image_path):
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # completely blank layout

    # Colors
    BG_COLOR = RGBColor(7, 13, 24)       # #070D18
    CARD_BG = RGBColor(15, 23, 42)       # #0F172A
    CARD_BORDER = RGBColor(30, 47, 77)   # #1E2F4D
    TEXT_WHITE = RGBColor(241, 245, 249) # #F1F5F9
    TEXT_MUTED = RGBColor(148, 163, 184) # #94A3B8
    CYAN = RGBColor(34, 211, 238)        # #22D3EE
    EMERALD = RGBColor(16, 185, 129)     # #10B981
    ROSE = RGBColor(239, 68, 68)         # #EF4444
    PURPLE = RGBColor(168, 85, 247)      # #A855F7
    AMBER = RGBColor(245, 158, 11)       # #F59E0B

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background() # no line

    def add_header(slide, category, title):
        # Category Tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.5), Inches(0.4))
        tf = cat_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = category.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = CYAN
        p.font.name = "Arial"

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.5), Inches(0.8))
        tf2 = title_box.text_frame
        tf2.word_wrap = True
        p2 = tf2.paragraphs[0]
        p2.text = title
        p2.font.size = Pt(24)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_WHITE
        p2.font.name = "Arial"

    def add_card(slide, left, top, width, height, border_color=CARD_BORDER, bg_color=CARD_BG):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        return card

    def add_speaker_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    # ==========================================
    # SLIDE 1: Title & Hook
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Category Pill
    pill = add_card(s1, Inches(4.66), Inches(1.1), Inches(4.0), Inches(0.45), CYAN, RGBColor(10, 25, 45))
    p = pill.text_frame.paragraphs[0]
    p.text = "• CET HACKATHON IDEA PITCH •"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = CYAN
    p.alignment = PP_ALIGN.CENTER

    # Main Title
    tbox = s1.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(11.33), Inches(2.2))
    tf = tbox.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "HDIMS"
    p1.font.size = Pt(56)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    p1.alignment = PP_ALIGN.CENTER

    p2 = tf.add_paragraph()
    p2.text = "Healthcare Dynamic Intelligence & Monitoring System"
    p2.font.size = Pt(26)
    p2.font.bold = True
    p2.font.color.rgb = CYAN
    p2.alignment = PP_ALIGN.CENTER

    p3 = tf.add_paragraph()
    p3.text = "\nClosing the clinical gap in India's ABDM with zero operating burden on the patient."
    p3.font.size = Pt(16)
    p3.font.color.rgb = TEXT_MUTED
    p3.alignment = PP_ALIGN.CENTER

    # 3 Stat Cards
    stat_data = [
        ("0", "Patient Burden", "No smartphones, OTPs, or apps required from patient", CYAN),
        ("< 30s", "JIT Access Lead Time", "Pre-provisions specialist before Code Blue", EMERALD),
        ("100%", "Auditable Trust", "Human-readable legal compliance ledger", PURPLE)
    ]
    for i, (val, label, sub, color) in enumerate(stat_data):
        c = add_card(s1, Inches(1.8 + i * 3.4), Inches(4.4), Inches(3.0), Inches(1.8))
        tf_c = c.text_frame
        tf_c.word_wrap = True
        pv = tf_c.paragraphs[0]
        pv.text = val
        pv.font.size = Pt(32)
        pv.font.bold = True
        pv.font.color.rgb = color
        pv.alignment = PP_ALIGN.CENTER

        pl = tf_c.add_paragraph()
        pl.text = label
        pl.font.size = Pt(13)
        pl.font.bold = True
        pl.font.color.rgb = TEXT_WHITE
        pl.alignment = PP_ALIGN.CENTER

        ps = tf_c.add_paragraph()
        ps.text = sub
        ps.font.size = Pt(10)
        ps.font.color.rgb = TEXT_MUTED
        ps.alignment = PP_ALIGN.CENTER

    add_speaker_notes(s1, "Good morning judges! India has linked over 900 million Ayushman Bharat health IDs and generated 82 crore digital medical records. On paper, we are a digital health superpower. But today, we are presenting HDIMS — Healthcare Dynamic Intelligence & Monitoring System — to solve the single greatest barrier in emergency clinical care: eliminating all operating burden from the patient while dynamically delivering life-saving data to clinicians.")

    # ==========================================
    # SLIDE 2: The Core Problem
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "The Real-World Paradox", "82 Crore Digital Health Records... But Doctors Still Fly Blind")

    # Left Card: Patient Reality
    c_left = add_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8), ROSE, RGBColor(25, 12, 20))
    tf_l = c_left.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "🚨 The Patient Reality at 2:00 AM\n"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = ROSE

    bullets_l = [
        "An unconscious, 72-year-old rural grandfather is brought into the emergency ward with acute dyspnea and chest pain.",
        "No Smartphone / No Literacy: He does not carry a smartphone and cannot operate touchscreens.",
        "OTP & App Barrier: He cannot read an OTP or approve consent requests on an app while struggling to breathe.",
        "Locked Cloud Vault: Critical life-saving records (past stent location, severe penicillin allergy) sit locked and idle in the cloud."
    ]
    for b in bullets_l:
        pb = tf_l.add_paragraph()
        pb.text = "• " + b + "\n"
        pb.font.size = Pt(13)
        pb.font.color.rgb = TEXT_WHITE

    # Right Card: Clinician's Dilemma
    c_right = add_card(s2, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.8), CARD_BORDER, CARD_BG)
    tf_r = c_right.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "🩺 The Clinician's Struggle\n"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = CYAN

    bullets_r = [
        "Blind Medical Decisions: Doctors are forced to administer emergency medications without knowing anaphylactic drug risks.",
        "Delayed Specialist Review: On-call cardiologists are paged late, arriving without historical context or angiography records.",
        "The Fatal Flaw of Modern Health Tech: Infrastructure demands the HIGHEST digital literacy from the exact patients who are in the GREATEST clinical danger."
    ]
    for b in bullets_r:
        pb = tf_r.add_paragraph()
        pb.text = "• " + b + "\n"
        pb.font.size = Pt(13)
        pb.font.color.rgb = TEXT_WHITE

    add_speaker_notes(s2, "Imagine an unconscious 72-year-old grandfather brought into a district emergency ward at 2:00 AM. He carries no smartphone, he cannot read an OTP, and he cannot navigate an app. His life-saving records — a past stent, a severe penicillin allergy — sit completely idle in the cloud while doctors fly blind. Digital health today fails the exact people who need it most: the elderly, rural, and critically ill.")

    # ==========================================
    # SLIDE 3: Why Existing Approaches Fail
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Market & Technology Gap", "Why Conventional Healthcare Systems Break Down")

    fails = [
        ("1. Bedside Vital Monitors", "Only sound alarms louder\n\n• Clinicians suffer from severe alert fatigue (up to 95% false alarms)\n• Doctors routinely silence buzzers\n• No record integration or intelligence", AMBER),
        ("2. Static Hospital EHRs", "Rigid Role-Based Access (RBAC)\n\n• Doctors either have perpetual full access (privacy violation) or zero access (care delay)\n• No dynamic escalation during acute deterioration\n• Massive risk of data leaks", CYAN),
        ("3. Patient Consent Apps", "Smartphone-dependent workflows\n\n• Assumes patient is conscious and tech-literate\n• Completely collapses in casualty, ICU, and resuscitation\n• Excludes 60%+ of rural elderly population", ROSE)
    ]
    for i, (title, text, color) in enumerate(fails):
        card = add_card(s3, Inches(0.8 + i * 4.0), Inches(1.9), Inches(3.7), Inches(4.7), color)
        tf = card.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = title + "\n"
        pt.font.size = Pt(18)
        pt.font.bold = True
        pt.font.color.rgb = color

        pbody = tf.add_paragraph()
        pbody.text = text
        pbody.font.size = Pt(13)
        pbody.font.color.rgb = TEXT_WHITE

    add_speaker_notes(s3, "Why do existing solutions fail? First, bedside monitors just sound louder alarms, causing severe alert fatigue where doctors mute buzzers. Second, hospital EHRs have static permissions: either full access or zero access, risking massive data leaks. Third, patient consent apps require active smartphone interactions, which completely fails in a cardiac emergency.")

    # ==========================================
    # SLIDE 4: The HDIMS Innovation
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "The HDIMS Architecture", "4 Core Pillars of HDIMS")

    pillars = [
        ("🩺 1. Real-Time NEWS2 Risk Engine", "Continuously computes physiological deterioration risk across 7 vital signs (RR, SpO2, BP, HR, Temp, Consciousness). Categorizes patients into Tier 1 (Green), Tier 2 (Amber), or Tier 3 (Red).", CYAN),
        ("🔐 2. Dynamic Just-In-Time (JIT) Access", "Dynamic Attribute-Based Access Control (ABAC). Automatically provisions an ephemeral 45-minute token to on-call specialists when risk hits Red; self-collapsing back to baseline upon recovery.", PURPLE),
        ("📜 3. Plain-Language Audit Ledger", "Converts cryptographic tokens into human-readable legal compliance statements for DISHA/ABDM statutory audit and automated zero-touch family SMS updates.", EMERALD),
        ("🛡️ 4. Zero Patient Operating Burden", "100% clinician-facing. Operates silently over existing hospital monitors without requiring touchscreens, passwords, or OTPs from the patient.", CYAN)
    ]
    for i, (title, text, color) in enumerate(pillars):
        x = Inches(0.8 + (i % 2) * 5.9)
        y = Inches(1.9 + (i // 2) * 2.5)
        card = add_card(s4, x, y, Inches(5.6), Inches(2.2), color)
        tf = card.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = title + "\n"
        pt.font.size = Pt(16)
        pt.font.bold = True
        pt.font.color.rgb = color

        pbody = tf.add_paragraph()
        pbody.text = text
        pbody.font.size = Pt(12)
        pbody.font.color.rgb = TEXT_WHITE

    add_speaker_notes(s4, "HDIMS introduces 4 foundational pillars: First, an automated NEWS2 physiological risk engine. Second, dynamic Just-In-Time access that unlocks sensitive records only when risk justifies it. Third, a plain-language audit trail that hospital legal teams can understand. And fourth, ZERO operational burden on the patient.")

    # ==========================================
    # SLIDE 5: Implementation Flow (With Architecture Diagram)
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Engineering Blueprint", "End-to-End System Implementation & Data Flow")

    if os.path.exists(image_path):
        s5.shapes.add_picture(image_path, Inches(0.8), Inches(1.8), Inches(11.73), Inches(4.5))
    else:
        # Fallback text
        fb = add_card(s5, Inches(0.8), Inches(1.8), Inches(11.73), Inches(4.5))
        fb.text_frame.text = "Implementation Flow Diagram"

    # Tech stack footer bar
    footer = add_card(s5, Inches(0.8), Inches(6.45), Inches(11.73), Inches(0.6), CYAN, RGBColor(10, 20, 35))
    p_f = footer.text_frame.paragraphs[0]
    p_f.text = "TECH STACK: React 18 + TypeScript + Tailwind CSS + Python FastAPI + NHS NEWS2 Engine + DISHA/FHIR R4 Standard"
    p_f.font.size = Pt(11)
    p_f.font.bold = True
    p_f.font.color.rgb = CYAN
    p_f.alignment = PP_ALIGN.CENTER

    add_speaker_notes(s5, "Here is our implementation flow: Bedside telemetry and ABDM FHIR records are ingested and normalized. The NEWS2 engine calculates risk in real time. When risk climbs, the Attribute-Based Access Control lattice pre-provisions an ephemeral 45-minute token to the specialist. When the patient stabilizes, access automatically collapses back to baseline, keeping records secure.")

    # ==========================================
    # SLIDE 6: UI Operational Flow
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Live Demo Architecture", "How the UI Operates (The 'Magic Moment')")

    c_a = add_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.4), CYAN, CARD_BG)
    tf_a = c_a.text_frame
    tf_a.word_wrap = True
    p = tf_a.paragraphs[0]
    p.text = "🟢 State A: Baseline Patient (NEWS2: 0)\n"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = EMERALD

    b_a = [
        "Bedside Staff Nurse View: Full visibility of live telemetry, ECG waveform, and routine medications.",
        "On-Call Specialist View: Sensitive historical catheterization and stent archives are SHIELDED and BLURRED.",
        "Least-Privilege Enforcement: Minimizes unnecessary data exposure while patient remains stable."
    ]
    for b in b_a:
        pb = tf_a.add_paragraph()
        pb.text = "• " + b + "\n"
        pb.font.size = Pt(13)
        pb.font.color.rgb = TEXT_WHITE

    c_b = add_card(s6, Inches(6.9), Inches(1.8), Inches(5.6), Inches(4.4), ROSE, RGBColor(25, 12, 20))
    tf_b = c_b.text_frame
    tf_b.word_wrap = True
    p = tf_b.paragraphs[0]
    p.text = "🔴 State B: Trigger (SpO2 < 85%)\n"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = ROSE

    b_b = [
        "Live Simulation: Moving the SpO2 slider to 83% and Pulse to 132 bpm immediately triggers Tier 3 (Critical).",
        "The Magic Moment: Cardiologist's screen flashes an emergency beacon and INSTANTLY UNBLURS the Xience Sierra DES stent details.",
        "45-Minute Ephemeral Countdown: Pre-provisions context BEFORE the doctor enters the room.",
        "Graceful Revocation: Normalizing vitals triggers auto-revocation, re-shielding the records."
    ]
    for b in b_b:
        pb = tf_b.add_paragraph()
        pb.text = "• " + b + "\n"
        pb.font.size = Pt(13)
        pb.font.color.rgb = TEXT_WHITE

    add_speaker_notes(s6, "Now, let me show you our live UI. On screen, Ramesh Kumar is stable in Bed 07. Notice that under the Cardiologist view, his catheterization records are shielded under least-privilege rules. Watch what happens when I simulate acute desaturation: SpO2 drops to 83%, the gauge turns Red, and immediately, his Xience Sierra stent specifications unblur with an active countdown timer!")

    # ==========================================
    # SLIDE 7: Feasibility, Security & Impact
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Impact & Evaluation", "Measurable Clinical, Legal, and Regulatory Advantages")

    metrics = [
        ("< 30 Seconds", "Specialist Access Lead Time", "Down from 18-35 minutes in conventional nurse-paging and login workflows. Eliminates care delay.", EMERALD),
        ("88% Reduction", "Unnecessary Data Exposure", "Strict least-privilege containment. Private medical records remain encrypted until risk justifies access.", CYAN),
        ("0 Barrier", "Patient Digital Literacy", "Protects elderly, rural, and unconscious patients without requiring smartphones or biometric interaction.", PURPLE)
    ]
    for i, (val, title, desc, color) in enumerate(metrics):
        card = add_card(s7, Inches(0.8 + i * 4.0), Inches(1.9), Inches(3.7), Inches(4.7), color)
        tf = card.text_frame
        tf.word_wrap = True
        pv = tf.paragraphs[0]
        pv.text = val
        pv.font.size = Pt(36)
        pv.font.bold = True
        pv.font.color.rgb = color
        pv.alignment = PP_ALIGN.CENTER

        pt = tf.add_paragraph()
        pt.text = "\n" + title + "\n"
        pt.font.size = Pt(16)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_WHITE
        pt.alignment = PP_ALIGN.CENTER

        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(13)
        pd.font.color.rgb = TEXT_MUTED
        pd.alignment = PP_ALIGN.CENTER

    add_speaker_notes(s7, "The impact is measurable: Lead time for specialist record access drops from 25 minutes to under 30 seconds. Unnecessary data exposure drops by 88% through automated least-privilege decay. And most importantly, zero digital literacy is demanded from the patient.")

    # ==========================================
    # SLIDE 8: Team & Roadmap
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "The Vision", "Roadmap & Scaling Milestones")

    phases = [
        ("Phase 1: Hackathon MVP", "Completed Today\n\n• Standalone interactive command center\n• Official NHS NEWS2 clinical scoring engine\n• Dynamic ABAC access lattice\n• Touch-and-test judge simulator dock", CYAN),
        ("Phase 2: Hospital Pilot", "Months 1 - 3\n\n• Deployment in GMC Hospital Ward 4B\n• Direct MQTT / HL7 telemetry ingestion from bedside vital monitors\n• Clinical feedback from ICU intensivist team", EMERALD),
        ("Phase 3: National Scale", "Months 4 - 8\n\n• National Health Authority (NHA) ABDM Sandbox certification\n• FHIR R4 emergency transfer protocol\n• Rollout to district public hospitals", PURPLE)
    ]
    for i, (title, desc, color) in enumerate(phases):
        card = add_card(s8, Inches(0.8 + i * 4.0), Inches(1.9), Inches(3.7), Inches(4.3), color)
        tf = card.text_frame
        tf.word_wrap = True
        pt = tf.paragraphs[0]
        pt.text = title + "\n"
        pt.font.size = Pt(17)
        pt.font.bold = True
        pt.font.color.rgb = color

        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(13)
        pd.font.color.rgb = TEXT_WHITE

    c_close = add_card(s8, Inches(0.8), Inches(6.35), Inches(11.73), Inches(0.65), CYAN, RGBColor(10, 25, 45))
    p_close = c_close.text_frame.paragraphs[0]
    p_close.text = "THANK YOU! Open for Live Demo & Questions."
    p_close.font.size = Pt(14)
    p_close.font.bold = True
    p_close.font.color.rgb = CYAN
    p_close.alignment = PP_ALIGN.CENTER

    add_speaker_notes(s8, "Our hackathon MVP is fully functional and running right now. Next, we will pilot with Ward 4B and certify with the NHA ABDM sandbox. Thank you, and we'd love to take you through the live interactive simulation!")

    prs.save(output_path)
    print(f"Presentation successfully saved to: {output_path}")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "HDIMS_Pitch_Deck.pptx"
    img = sys.argv[2] if len(sys.argv) > 2 else "hdims_implementation_flow.jpg"
    create_hdims_presentation(out, img)
