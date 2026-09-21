"""Generate the P9, P12 and P13 FORTICEM hollow concrete-block GLB family."""

from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFilter
from shapely.affinity import translate
from shapely.geometry import Polygon, box
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "models" / "king-block-familia-v1.glb"


def concrete_texture() -> Image.Image:
    size = 384
    rng = np.random.default_rng(113)
    fine = rng.normal(0, 9, (size, size))
    coarse_source = np.uint8(np.clip((rng.normal(0, 1, (size, size)) + 3) * 38, 0, 255))
    coarse = np.asarray(Image.fromarray(coarse_source).filter(ImageFilter.GaussianBlur(7)), dtype=float)
    noise = fine + (coarse - coarse.mean()) * 0.15

    pixels = np.empty((size, size, 3), dtype=np.float32)
    for channel, value in enumerate((174, 173, 168)):
        pixels[:, :, channel] = value + noise

    image = Image.fromarray(np.uint8(np.clip(pixels, 0, 255)), "RGB")
    draw = ImageDraw.Draw(image)
    for _ in range(470):
        x, y = (int(value) for value in rng.integers(0, size, 2))
        radius = int(rng.choice([1, 1, 1, 2]))
        shade = int(rng.integers(55, 130))
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
        uv[face] = projection * 16
    return uv


def rounded_rectangle(width: float, depth: float, radius: float):
    return box(
        -width / 2 + radius,
        -depth / 2 + radius,
        width / 2 - radius,
        depth / 2 - radius,
    ).buffer(radius, resolution=2)


def hollow_block(
    length: float,
    depth: float,
    height: float,
    wall: float,
    web: float,
    material: PBRMaterial,
) -> trimesh.Trimesh:
    """Two-cell block with actual open cavities and a solid central web."""
    outer_radius = 0.003
    outer = rounded_rectangle(length, depth, outer_radius)
    cavity_length = (length - wall * 2 - web) / 2
    cavity_depth = depth - wall * 2
    cavity_radius = min(0.002, cavity_length * 0.12, cavity_depth * 0.12)
    offset = web / 2 + cavity_length / 2
    holes = []
    for center_x in (-offset, offset):
        cavity = rounded_rectangle(cavity_length, cavity_depth, cavity_radius)
        cavity = translate(cavity, xoff=center_x)
        holes.append(cavity)

    section = Polygon(
        shell=list(outer.exterior.coords),
        holes=[list(cavity.exterior.coords) for cavity in holes],
    )
    mesh = trimesh.creation.extrude_polygon(section, height)
    mesh.apply_transform(trimesh.transformations.rotation_matrix(np.radians(-90), [1, 0, 0]))
    mesh.apply_translation([0, -mesh.bounds[0, 1], 0])
    mesh.visual = TextureVisuals(uv=face_uv(mesh), material=material)
    return mesh


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    material = PBRMaterial(
        name="FORTICEM King Block Concrete",
        baseColorFactor=[255, 255, 255, 255],
        baseColorTexture=concrete_texture(),
        metallicFactor=0.0,
        roughnessFactor=0.96,
        alphaMode="OPAQUE",
    )

    scene = trimesh.Scene()
    variants = [
        ("P13", (0.205, 0.095, 0.095, 0.016, 0.017), (0.0, 0.0, -0.070), 0),
        ("P9", (0.225, 0.068, 0.076, 0.014, 0.015), (-0.145, 0.0, 0.048), -9),
        ("P12", (0.155, 0.092, 0.102, 0.016, 0.017), (0.135, 0.0, 0.050), 9),
    ]

    for name, dimensions, position, yaw in variants:
        model = hollow_block(*dimensions, material)
        transform = trimesh.transformations.concatenate_matrices(
            trimesh.transformations.translation_matrix(position),
            trimesh.transformations.rotation_matrix(np.radians(yaw), [0, 1, 0]),
        )
        model.apply_transform(transform)
        scene.add_geometry(model, node_name=f"King_Block_{name}", geom_name=f"King_Block_{name}")

    OUTPUT.write_bytes(scene.export(file_type="glb"))
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
