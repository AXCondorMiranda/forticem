"""Generate the 20, 25 and 30 cm FORTICEM concrete screed-guide GLB family."""

from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import box
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "models" / "escantillon-concreto-v1.glb"


def concrete_texture() -> Image.Image:
    """Warm-white precast concrete with restrained pores and aggregate variation."""
    size = 384
    rng = np.random.default_rng(83)
    fine = rng.normal(0, 8, (size, size))
    coarse_source = np.uint8(np.clip((rng.normal(0, 1, (size, size)) + 3) * 38, 0, 255))
    coarse = np.asarray(Image.fromarray(coarse_source).filter(ImageFilter.GaussianBlur(8)), dtype=float)
    noise = fine + (coarse - coarse.mean()) * 0.13

    pixels = np.empty((size, size, 3), dtype=np.float32)
    for channel, value in enumerate((207, 205, 199)):
        pixels[:, :, channel] = value + noise

    image = Image.fromarray(np.uint8(np.clip(pixels, 0, 255)), "RGB")
    draw = ImageDraw.Draw(image)
    for _ in range(410):
        x, y = (int(value) for value in rng.integers(0, size, 2))
        radius = int(rng.choice([1, 1, 1, 2]))
        shade = int(rng.integers(70, 155))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(shade, shade, shade))
    return image


def face_uv(mesh: trimesh.Trimesh) -> np.ndarray:
    mesh.unmerge_vertices()
    uv = np.zeros((len(mesh.vertices), 2), dtype=np.float32)
    for face_index, face in enumerate(mesh.faces):
        normal = np.abs(mesh.face_normals[face_index])
        vertices = mesh.vertices[face]
        axis = int(np.argmax(normal))
        if axis == 0:
            projection = vertices[:, [2, 1]]
        elif axis == 1:
            projection = vertices[:, [0, 2]]
        else:
            projection = vertices[:, [0, 1]]
        uv[face] = projection * 18
    return uv


def escantillon(length: float, material: PBRMaterial) -> trimesh.Trimesh:
    # Proportions are based on the supplied orthographic and isometric views.
    width, depth, radius = 0.043, 0.037, 0.0018
    cross_section = box(
        -width / 2 + radius,
        -depth / 2 + radius,
        width / 2 - radius,
        depth / 2 - radius,
    ).buffer(radius, resolution=2)

    mesh = trimesh.creation.extrude_polygon(cross_section, length)
    mesh.apply_transform(trimesh.transformations.rotation_matrix(np.radians(-90), [1, 0, 0]))
    mesh.apply_translation([0, -mesh.bounds[0, 1], 0])
    mesh.visual = TextureVisuals(uv=face_uv(mesh), material=material)
    return mesh


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    material = PBRMaterial(
        name="FORTICEM Escantillon Concrete",
        baseColorFactor=[255, 255, 255, 255],
        baseColorTexture=concrete_texture(),
        metallicFactor=0.0,
        roughnessFactor=0.94,
        alphaMode="OPAQUE",
    )

    scene = trimesh.Scene()
    variants = [
        ("30_cm", 0.30, (0.0, 0.0, -0.035), 0),
        ("25_cm", 0.25, (-0.057, 0.0, 0.025), -8),
        ("20_cm", 0.20, (0.057, 0.0, 0.025), 8),
    ]

    for name, length, position, yaw in variants:
        model = escantillon(length, material)
        transform = trimesh.transformations.concatenate_matrices(
            trimesh.transformations.translation_matrix(position),
            trimesh.transformations.rotation_matrix(np.radians(yaw), [0, 1, 0]),
        )
        model.apply_transform(transform)
        scene.add_geometry(model, node_name=f"Escantillon_{name}", geom_name=f"Escantillon_{name}")
    OUTPUT.write_bytes(scene.export(file_type="glb"))
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
