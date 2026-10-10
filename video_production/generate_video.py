import os
import subprocess
import time
import http.server
import socketserver
import threading

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
DIST_DIR = os.path.join(PROJECT_ROOT, 'frontend', 'dist')
CHROME_PATH = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
OUTPUT_VIDEO = os.path.join(PROJECT_ROOT, 'recycle2feed_demo_video.mp4')

SCENES = [
    {
        "id": "scene_01",
        "url": "http://localhost:4173/",
        "text": "Welcome to ReCycle2Feed, built for the Bharat Builds Tour Environmental Hacks in the Waste and Energy track. Across Indian cities and campuses, millions of recyclable plastic bottles and cans end up in mixed garbage because conventional bins offer zero incentive. At the same time, community animals face irregular, unmonitored feeding. ReCycle2Feed connects source-segregated recycling directly with community animal welfare."
    },
    {
        "id": "scene_02",
        "url": "http://localhost:4173/kiosk",
        "text": "This is our smart recycling kiosk. A user deposits an eligible PET bottle or aluminium can into the intake slot. Dual sensors verify the material, internal compactors crush the container, and our AWS Lambda microservice authorizes a metered portion of animal feed into a sheltered bowl. Notice our persistent Mode Indicator: all simulated actions are strictly labeled for complete integrity."
    },
    {
        "id": "scene_03",
        "url": "http://localhost:4173/kiosk",
        "text": "Here, we simulate depositing an eligible 28 gram PET beverage bottle and select the Community Dog Feeding hopper. The kiosk validates material geometry, verifies unique event idempotency, and dispenses a calibrated 20 gram portion of kibble. An immutable digital receipt is generated with server-verified timestamps and full event reference."
    },
    {
        "id": "scene_04",
        "url": "http://localhost:4173/kiosk",
        "text": "We never fabricate success. If someone deposits a glass container or hazardous e-waste, the compactor safety check rejects it with a clear plain-English explanation. If the food hopper runs empty, the bottle is collected for recycling, but the system honestly reports that dispensing failed and alerts campus caretakers."
    },
    {
        "id": "scene_05",
        "url": "http://localhost:4173/impact",
        "text": "Our Impact Dashboard provides an auditable environmental ledger. Instead of arbitrary carbon formulas, we track actual measured mass in kilograms. Our Unit Economics model proves circular feasibility: crushed PET scrap yields 38 rupees per kilo, offsetting the 1 rupee 70 paise wholesale feed portion."
    },
    {
        "id": "scene_06",
        "url": "http://localhost:4173/operator",
        "text": "On the Operator Console, field caretakers monitor recycling bin fill capacity with a 95 percent safety lockout threshold, inspect food hopper levels, clear mechanical motor jams, and record field sanitization actions."
    },
    {
        "id": "scene_07",
        "url": "http://localhost:4173/how-it-works",
        "text": "Under the hood, ReCycle2Feed is built with AWS SAM, deploying Amazon API Gateway HTTP API, AWS Lambda on ARM64 Graviton, and Amazon DynamoDB with conditional writes to prevent double-rewarding. All 14 automated unit tests pass. ReCycle2Feed: Turning waste into care. Thank you."
    }
]

def generate_audio(scene_id, text, out_wav):
    ps_script = f'''
Add-Type -AssemblyName System.Speech
$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice.Rate = 0
$voice.SetOutputToWaveFile("{out_wav.replace(os.sep, '/')}")
$voice.Speak("{text}")
$voice.Dispose()
'''
    ps_file = os.path.join(BASE_DIR, f"{scene_id}_tts.ps1")
    with open(ps_file, "w", encoding="utf-8") as f:
        f.write(ps_script)
    subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", ps_file], check=True)
    if os.path.exists(ps_file):
        os.remove(ps_file)

def get_audio_duration(wav_path):
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        wav_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def capture_screenshot(url, out_png):
    cmd = [
        CHROME_PATH,
        '--headless=new',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--virtual-time-budget=3000',
        f'--screenshot={out_png}',
        url
    ]
    subprocess.run(cmd, check=True)

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return super().do_GET()

def main():
    os.makedirs(BASE_DIR, exist_ok=True)
    print("=== Starting ReCycle2Feed Video Generator ===")

    # 1. Start local SPA server
    httpd = socketserver.TCPServer(('', 4173), SPAHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print("Local preview server running at http://localhost:4173")
    time.sleep(1)

    scene_clips = []
    concat_list_path = os.path.join(BASE_DIR, "concat_list.txt")

    for i, scene in enumerate(SCENES):
        sid = scene["id"]
        print(f"\n--- Processing {sid} ({i+1}/{len(SCENES)}) ---")
        
        wav_path = os.path.join(BASE_DIR, f"{sid}.wav")
        png_path = os.path.join(BASE_DIR, f"{sid}.png")
        clip_path = os.path.join(BASE_DIR, f"{sid}.mp4")

        # Step A: Voiceover
        print(f"Generating voiceover audio for {sid}...")
        generate_audio(sid, scene["text"], wav_path)
        dur = get_audio_duration(wav_path) + 0.8  # Add 0.8s padding
        print(f"Audio duration: {dur:.2f}s")

        # Step B: Capture screenshot
        print(f"Capturing high-definition screenshot for {sid} from {scene['url']}...")
        capture_screenshot(scene["url"], png_path)

        # Step C: Render video clip with ffmpeg
        print(f"Rendering MP4 scene clip with pan/scale effect...")
        cmd_clip = [
            "ffmpeg",
            "-y",
            "-loop", "1",
            "-i", png_path,
            "-i", wav_path,
            "-c:v", "libx264",
            "-tune", "stillimage",
            "-c:a", "aac",
            "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-t", str(dur),
            "-vf", "scale=1920:1080",
            clip_path
        ]
        subprocess.run(cmd_clip, check=True)
        scene_clips.append(clip_path)

    # 2. Concat all clips into final video
    print("\n--- Assembling Final Video ---")
    with open(concat_list_path, "w", encoding="utf-8") as f:
        for clip in scene_clips:
            # ffmpeg concat needs forward slashes
            escaped = clip.replace(os.sep, "/")
            f.write(f"file '{escaped}'\n")

    cmd_concat = [
        "ffmpeg",
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", concat_list_path,
        "-c", "copy",
        OUTPUT_VIDEO
    ]
    subprocess.run(cmd_concat, check=True)

    httpd.shutdown()

    total_dur = get_audio_duration(OUTPUT_VIDEO)
    file_size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
    print("\n=======================================================")
    print(f"SUCCESS! Video created at: {OUTPUT_VIDEO}")
    print(f"Total Duration: {total_dur:.2f} seconds ({total_dur/60:.2f} minutes)")
    print(f"File Size: {file_size_mb:.2f} MB")
    print("=======================================================")

if __name__ == "__main__":
    main()
