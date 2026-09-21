from pathlib import Path
import sys

from PIL import Image


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: create_partner_monochrome.py INPUT OUTPUT")

    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    image = Image.open(source).convert("RGBA")
    monochrome = Image.new("RGBA", image.size, "#39414c")
    monochrome.putalpha(image.getchannel("A"))
    destination.parent.mkdir(parents=True, exist_ok=True)
    monochrome.save(destination, optimize=True)
    print(f"{destination}|{image.width}x{image.height}")


if __name__ == "__main__":
    main()
