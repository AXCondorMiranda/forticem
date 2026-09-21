"""Generate the FLOW, CURE and RELEASE FORTICEM additive packaging GLB family."""

from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFont
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "models" / "aditivos-forticem-familia-v1.glb"


def font(size: int):
    try:
        return ImageFont.truetype("arialbd.ttf", size)
    except OSError:
        return ImageFont.load_default()


def label_texture(product: str, volume: str) -> Image.Image:
    width, height = 512, 256
    image = Image.new("RGB", (width, height), (242, 243, 242))
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 76, width, 176), fill=(12, 18, 25))
    draw.rectangle((0, 176, width, 185), fill=(13, 184, 144))

    brand = "FORTICEM"
    product_text = f"FORTICEM {product}"
    brand_font = font(31)
    product_font = font(39)
    volume_font = font(28)

    brand_box = draw.textbbox((0, 0), brand, font=brand_font)
    product_box = draw.textbbox((0, 0), product_text, font=product_font)
    volume_box = draw.textbbox((0, 0), volume, font=volume_font)
    draw.text(((width - (brand_box[2] - brand_box[0])) / 2, 24), brand, fill=(8, 15, 24), font=brand_font)
    draw.text(((width - (product_box[2] - product_box[0])) / 2, 105), product_text, fill="white", font=product_font)
    draw.text(((width - (volume_box[2] - volume_box[0])) / 2, 205), volume, fill=(8, 15, 24), font=volume_font)
    return image


def white_material() -> PBRMaterial:
    return PBRMaterial(
        name="FORTICEM White Packaging",
        baseColorFactor=[238, 240, 239, 255],
        metallicFactor=0.0,
        roughnessFactor=0.35,
        alphaMode="OPAQUE",
    )


def cylindrical_uv(mesh: trimesh.Trimesh) -> np.ndarray:
    mesh.unmerge_vertices()
    vertices = mesh.vertices
    uv = np.zeros((len(vertices), 2), dtype=np.float32)
    # Reverse the angular axis so label typography reads left-to-right from outside.
    uv[:, 0] = 0.5 - np.arctan2(vertices[:, 2], vertices[:, 0]) / (2 * np.pi)
    y_min, y_max = vertices[:, 1].min(), vertices[:, 1].max()
    uv[:, 1] = (vertices[:, 1] - y_min) / max(y_max - y_min, 1e-6)
    for face in mesh.faces:
        values = uv[face, 0]
        if values.max() - values.min() > 0.5:
            low = face[values < 0.5]
            uv[low, 0] += 1.0
    return uv


def y_cylinder(radius: float, height: float, y: float, sections: int = 40) -> trimesh.Trimesh:
    mesh = trimesh.creation.cylinder(radius=radius, height=height, sections=sections)
    mesh.apply_transform(trimesh.transformations.rotation_matrix(np.radians(-90), [1, 0, 0]))
    mesh.apply_translation([0, y + height / 2, 0])
    return mesh


def drum(product: str, position: tuple[float, float, float], yaw: float, scene: trimesh.Scene) -> None:
    # Realistic 200 L proportion and a raised label clear of the 20 L bucket.
    radius, height = 0.044, 0.140
    pieces = [y_cylinder(radius, height, 0)]
    for y, ring_height in ((0.004, 0.006), (0.036, 0.004), (0.105, 0.004), (0.130, 0.007)):
        pieces.append(y_cylinder(radius + 0.0022, ring_height, y))
    body = trimesh.util.concatenate(pieces)
    body.visual.material = white_material()

    sleeve = y_cylinder(radius + 0.0027, 0.058, 0.064, sections=48)
    sleeve.visual = TextureVisuals(
        uv=cylindrical_uv(sleeve),
        material=PBRMaterial(
            name=f"{product} 200 L label",
            baseColorFactor=[255, 255, 255, 255],
            baseColorTexture=label_texture(product, "200 L"),
            metallicFactor=0.0,
            roughnessFactor=0.52,
            alphaMode="OPAQUE",
        ),
    )

    bungs = []
    for x in (-0.021, 0.021):
        bung = y_cylinder(0.0042, 0.0028, height)
        bung.apply_translation([x, 0, 0])
        bungs.append(bung)
    closures = trimesh.util.concatenate(bungs)
    closures.visual.material = PBRMaterial(
        name="Drum closures",
        baseColorFactor=[35, 39, 42, 255],
        metallicFactor=0.65,
        roughnessFactor=0.3,
        alphaMode="OPAQUE",
    )

    transform = trimesh.transformations.concatenate_matrices(
        trimesh.transformations.translation_matrix(position),
        trimesh.transformations.rotation_matrix(np.radians(yaw), [0, 1, 0]),
    )
    for suffix, geometry in (("Tambor", body), ("Etiqueta_200L", sleeve), ("Cierres", closures)):
        geometry.apply_transform(transform)
        scene.add_geometry(geometry, node_name=f"{product}_{suffix}", geom_name=f"{product}_{suffix}")


def bucket(
    product: str,
    volume: str,
    radius: float,
    height: float,
    position: tuple[float, float, float],
    yaw: float,
    scene: trimesh.Scene,
) -> None:
    body = y_cylinder(radius, height, 0, sections=36)
    normalized_y = np.clip(body.vertices[:, 1] / height, 0.0, 1.0)
    taper = 0.86 + normalized_y * 0.14
    body.vertices[:, 0] *= taper
    body.vertices[:, 2] *= taper

    lid = y_cylinder(radius + 0.002, 0.005, height - 0.002, sections=36)
    lower_rim = y_cylinder(radius * 0.9, 0.0035, 0.002, sections=36)
    packaging = trimesh.util.concatenate([body, lid, lower_rim])
    packaging.visual.material = white_material()

    sleeve_height = height * 0.54
    sleeve = y_cylinder(radius + 0.0025, sleeve_height, height * 0.25, sections=44)
    normalized_y = np.clip(sleeve.vertices[:, 1] / height, 0.0, 1.0)
    sleeve_scale = 0.86 + normalized_y * 0.14
    sleeve.vertices[:, 0] *= sleeve_scale
    sleeve.vertices[:, 2] *= sleeve_scale
    sleeve.visual = TextureVisuals(
        uv=cylindrical_uv(sleeve),
        material=PBRMaterial(
            name=f"{product} {volume} label",
            baseColorFactor=[255, 255, 255, 255],
            baseColorTexture=label_texture(product, volume),
            metallicFactor=0.0,
            roughnessFactor=0.5,
            alphaMode="OPAQUE",
        ),
    )

    transform = trimesh.transformations.concatenate_matrices(
        trimesh.transformations.translation_matrix(position),
        trimesh.transformations.rotation_matrix(np.radians(yaw), [0, 1, 0]),
    )
    for suffix, geometry in ((f"Balde_{volume}", packaging), (f"Etiqueta_{volume}", sleeve)):
        geometry.apply_transform(transform)
        safe_volume = volume.replace(" ", "")
        scene.add_geometry(geometry, node_name=f"{product}_{suffix}_{safe_volume}", geom_name=f"{product}_{suffix}_{safe_volume}")


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    scene = trimesh.Scene()
    products = [
        ("FLOW", -0.145, -8),
        ("CURE", 0.0, 0),
        ("RELEASE", 0.145, 8),
    ]
    for product, x, yaw in products:
        drum(product, (x, 0.0, -0.038), yaw, scene)
        bucket(product, "20 L", 0.028, 0.066, (x + 0.038, 0.0, 0.046), yaw, scene)
        bucket(product, "4 L", 0.020, 0.044, (x + 0.073, 0.0, 0.070), yaw, scene)

    OUTPUT.write_bytes(scene.export(file_type="glb"))
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
