"""Generate a textured, single-piece Block Grass tipo 8 GLB for the product page.

The 22 × 41 × 9 cm outer envelope is the stated product dimension. The
profile and two diamond openings are modeled from the user-provided visual
reference; their internal dimensions are illustrative, not a shop drawing.
"""

from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import Polygon
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "models" / "block-grass-tipo-8-v1.glb"


def concrete_maps(seed: int = 28) -> tuple[Image.Image, Image.Image]:
    size = 512
    rng = np.random.default_rng(seed)
    fine = rng.normal(0, 8.8, (size, size))
    grain = rng.normal(0, 1, (size, size))
    coarse = np.asarray(
        Image.fromarray(np.uint8(np.clip((grain + 3) * 36, 0, 255)))
        .filter(ImageFilter.GaussianBlur(6)),
        dtype=float,
    )
    height = fine + (coarse - coarse.mean()) * 0.23

    base = (150, 148, 142)
    rgb = np.empty((size, size, 3), dtype=np.float32)
    for channel, value in enumerate(base):
        rgb[:, :, channel] = value + height
    color = Image.fromarray(np.uint8(np.clip(rgb, 0, 255)), "RGB")
    draw = ImageDraw.Draw(color)
    for _ in range(920):
        x, y = rng.integers(0, size, 2)
        radius = int(rng.choice([1, 1, 1, 2, 2, 3]))
        shade = int(rng.integers(80, 150))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(shade, shade - 1, shade - 3))
    for _ in range(175):
        x, y = rng.integers(0, size, 2)
        radius = int(rng.choice([1, 2, 2, 3]))
        shade = int(rng.integers(188, 225))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(shade, shade, shade - 2))

    dy, dx = np.gradient(height)
    normal = np.dstack((-dx * 0.13, -dy * 0.13, np.ones_like(dx)))
    normal /= np.linalg.norm(normal, axis=2, keepdims=True)
    normal = np.uint8(np.clip((normal * 0.5 + 0.5) * 255, 0, 255))
    return color, Image.fromarray(normal, "RGB")


def box_uv(mesh: trimesh.Trimesh, repeat: float = 10.0) -> np.ndarray:
    mesh.unmerge_vertices()
    uv = np.zeros((len(mesh.vertices), 2), dtype=np.float32)
    for index, face in enumerate(mesh.faces):
        axis = int(np.argmax(np.abs(mesh.face_normals[index])))
        vertices = mesh.vertices[face]
        if axis == 0:
            projection = vertices[:, [2, 1]]
        elif axis == 1:
            projection = vertices[:, [0, 2]]
        else:
            projection = vertices[:, [0, 1]]
        uv[face] = projection * repeat
    return uv


def build_tipo_8() -> trimesh.Trimesh:
    # X = width (22 cm), Y = length (41 cm), Z = thickness (9 cm).
    # The central insets articulate one connected figure-eight piece.
    outline_cm = [
        (-6.2, 20.5), (6.2, 20.5), (11.0, 15.3), (11.0, 7.0),
        (5.1, 0.0), (11.0, -7.0), (11.0, -15.3), (6.2, -20.5),
        (-6.2, -20.5), (-11.0, -15.3), (-11.0, -7.0), (-5.1, 0.0),
        (-11.0, 7.0), (-11.0, 15.3),
    ]

    def diamond(y: float) -> list[tuple[float, float]]:
        return [(0.0, y + 6.6), (6.1, y), (0.0, y - 6.6), (-6.1, y)]

    scale = 0.01
    outline = [(x * scale, y * scale) for x, y in outline_cm]
    openings = [
        [(x * scale, y * scale) for x, y in diamond(center)]
        for center in (10.25, -10.25)
    ]
    footprint = Polygon(outline, holes=openings)
    if not footprint.is_valid:
        raise ValueError("Invalid figure-eight footprint")

    thickness = 0.09
    mesh = trimesh.creation.extrude_polygon(footprint, height=thickness)
    mesh.apply_translation([0, 0, -thickness / 2])
    # glTF/model-viewer uses Y up; the long face lies in the X-Z plane.
    mesh.apply_transform(trimesh.transformations.rotation_matrix(np.radians(-90), [1, 0, 0]))
    mesh.remove_unreferenced_vertices()
    mesh.merge_vertices()
    if not mesh.is_watertight:
        raise ValueError("Tipo 8 solid is not watertight before UV seam duplication")

    color, normal = concrete_maps()
    material = PBRMaterial(
        name="FORTICEM Tipo 8 Concrete",
        baseColorFactor=[255, 255, 255, 255],
        baseColorTexture=color,
        normalTexture=normal,
        metallicFactor=0.0,
        roughnessFactor=0.94,
        alphaMode="OPAQUE",
    )
    mesh.visual = TextureVisuals(uv=box_uv(mesh), material=material)
    mesh.metadata["product"] = "Block Grass tipo 8"
    mesh.metadata["dimensions_cm"] = "22 x 41 x 9"
    mesh.metadata["geometry_note"] = "Visual reference, internal openings approximate"
    return mesh


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    mesh = build_tipo_8()
    scene = trimesh.Scene()
    scene.add_geometry(mesh, node_name="Block_Grass_Tipo_8", geom_name="Block_Grass_Tipo_8")
    OUTPUT.write_bytes(scene.export(file_type="glb"))
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size:,} bytes)")
    print(f"Bounds (m): {(mesh.bounds[1] - mesh.bounds[0]).round(4)}")


if __name__ == "__main__":
    main()
