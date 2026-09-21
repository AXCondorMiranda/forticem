"""Generate a lightweight three-color FORTICEM paver family GLB."""

from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import box
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "models" / "adoquines-familia-v1.glb"


def concrete_map(base_rgb: tuple[int, int, int], seed: int) -> Image.Image:
    size = 320
    rng = np.random.default_rng(seed)
    fine = rng.normal(0, 11, (size, size))
    coarse = np.asarray(
        Image.fromarray(np.uint8(np.clip((rng.normal(0, 1, (size, size)) + 3) * 38, 0, 255)))
        .filter(ImageFilter.GaussianBlur(7)),
        dtype=float,
    )
    noise = fine + (coarse - coarse.mean()) * 0.15
    pixels = np.empty((size, size, 3), dtype=np.float32)
    for channel, value in enumerate(base_rgb):
        pixels[:, :, channel] = value + noise
    image = Image.fromarray(np.uint8(np.clip(pixels, 0, 255)), "RGB")
    draw = ImageDraw.Draw(image)
    for _ in range(320):
        x, y = rng.integers(0, size, 2)
        shade = tuple(max(20, int(value * rng.uniform(0.5, 0.82))) for value in base_rgb)
        draw.point((int(x), int(y)), fill=shade)
    return image


def face_uv(mesh: trimesh.Trimesh) -> np.ndarray:
    mesh.unmerge_vertices()
    uv = np.zeros((len(mesh.vertices), 2), dtype=np.float32)
    for face_index, face in enumerate(mesh.faces):
        normal = np.abs(mesh.face_normals[face_index])
        vertices = mesh.vertices[face]
        axis = int(np.argmax(normal))
        projection = vertices[:, [2, 1]] if axis == 0 else vertices[:, [0, 2]] if axis == 1 else vertices[:, [0, 1]]
        uv[face] = projection * 15
    return uv


def paver(name: str, color: tuple[int, int, int], seed: int) -> trimesh.Trimesh:
    length, width, height, radius = 0.20, 0.10, 0.08, 0.007
    footprint = box(-length / 2 + radius, -width / 2 + radius, length / 2 - radius, width / 2 - radius).buffer(radius)
    mesh = trimesh.creation.extrude_polygon(footprint, height)
    mesh.apply_translation(-mesh.centroid)
    mesh.apply_transform(trimesh.transformations.rotation_matrix(np.radians(-90), [1, 0, 0]))
    mesh.apply_translation([0, height / 2, 0])
    material = PBRMaterial(
        name=f"Concrete {name}",
        baseColorFactor=[255, 255, 255, 255],
        baseColorTexture=concrete_map(color, seed),
        metallicFactor=0.0,
        roughnessFactor=0.92,
        alphaMode="OPAQUE",
    )
    mesh.visual = TextureVisuals(uv=face_uv(mesh), material=material)
    return mesh


def groove(name: str, color: tuple[int, int, int]) -> trimesh.Trimesh:
    strip = trimesh.creation.box(extents=[0.006, 0.052, 0.0016])
    strip.visual.material = PBRMaterial(
        name=f"{name} groove",
        baseColorFactor=[*color, 255],
        metallicFactor=0.0,
        roughnessFactor=0.98,
        alphaMode="OPAQUE",
    )
    return strip


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    scene = trimesh.Scene()
    variants = [
        ("Rojo", (145, 48, 48), 31, (-0.13, 0.0, 0.055), -10),
        ("Gris", (142, 145, 143), 37, (0.13, 0.0, 0.055), 9),
        ("Negro", (48, 51, 53), 43, (0.01, 0.105, -0.035), -2),
    ]

    for name, color, seed, position, yaw in variants:
        body = paver(name, color, seed)
        rotation = trimesh.transformations.rotation_matrix(np.radians(yaw), [0, 1, 0])
        transform = trimesh.transformations.concatenate_matrices(
            trimesh.transformations.translation_matrix(position), rotation
        )
        body.apply_transform(transform)
        scene.add_geometry(body, node_name=f"Adoquin_{name}", geom_name=f"Adoquin_{name}")

        groove_color = tuple(max(12, int(channel * 0.48)) for channel in color)
        for offset in (-0.055, 0.055):
            detail = groove(name, groove_color)
            detail.apply_translation([offset, 0.04, 0.0508])
            detail.apply_transform(transform)
            scene.add_geometry(detail, node_name=f"Adoquin_{name}_Ranura_{offset}")

    OUTPUT.write_bytes(scene.export(file_type="glb"))
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
