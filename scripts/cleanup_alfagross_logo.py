from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


SOURCE = Path(r"C:\Users\Xavier\AppData\Local\Temp\codex-clipboard-0b87235e-9af7-4361-9232-334d4e9d5142.png")
OUTPUT_DIR = Path(r"C:\Users\Xavier\Documents\ChatGPT\New project\assets\images\partners")
QA_DIR = Path(r"C:\Users\Xavier\Documents\ChatGPT\New project\tmp")
OUTPUT = OUTPUT_DIR / "alfagross-logo-transparent-v1.png"
MONOCHROME_OUTPUT = OUTPUT_DIR / "alfagross-logo-monochrome-v1.png"


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    rgb = np.asarray(image).astype(np.float32)
    maximum = rgb.max(axis=2)
    minimum = rgb.min(axis=2)
    chroma = maximum - minimum

    # The supplied mark is neutral white/silver; the backdrop is blue.
    # This creates a soft alpha edge while excluding the blue photograph.
    neutrality = 1.0 - chroma / np.maximum(maximum, 1.0)
    brightness = maximum / 255.0
    alpha_neutral = np.clip((neutrality - 0.68) / 0.25, 0.0, 1.0)
    alpha_bright = np.clip((brightness - 0.30) / 0.18, 0.0, 1.0)
    alpha = alpha_neutral * alpha_bright
    alpha[alpha < 0.10] = 0.0

    alpha_image = Image.fromarray(np.uint8(alpha * 255), "L")
    alpha_image = alpha_image.filter(ImageFilter.MedianFilter(3))

    rgba = image.convert("RGBA")
    rgba.putalpha(alpha_image)
    bbox = alpha_image.getbbox()
    if bbox is None:
        raise RuntimeError("No logo pixels were detected")

    left, top, right, bottom = bbox
    padding = 10
    crop_box = (
        max(0, left - padding),
        max(0, top - padding),
        min(rgba.width, right + padding),
        min(rgba.height, bottom + padding),
    )
    rgba = rgba.crop(crop_box)

    # Upscale once for crisp rendering on high-density screens.
    scale = 4
    rgba = rgba.resize((rgba.width * scale, rgba.height * scale), Image.Resampling.LANCZOS)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    rgba.save(OUTPUT, optimize=True)

    monochrome = Image.new("RGBA", rgba.size, "#39414c")
    monochrome.putalpha(rgba.getchannel("A"))
    monochrome.save(MONOCHROME_OUTPUT, optimize=True)

    # QA composites make transparent-edge inspection deterministic.
    QA_DIR.mkdir(parents=True, exist_ok=True)
    for name, color in (("white", "#ffffff"), ("navy", "#04142f")):
        base = Image.new("RGBA", rgba.size, color)
        base.alpha_composite(rgba)
        base.convert("RGB").save(QA_DIR / f"alfagross-logo-qa-{name}.jpg", quality=92)

    print(f"{OUTPUT}|{rgba.width}x{rgba.height}")


if __name__ == "__main__":
    main()
