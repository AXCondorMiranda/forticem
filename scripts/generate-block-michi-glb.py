"""Generate the lightweight Block Grass tipo Michi GLB used in the home hero."""

from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import box
from shapely.ops import unary_union
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "models" / "block-michi-v1.glb"


def concrete_maps(base_rgb: tuple[int, int, int], seed: int = 14) -> tuple[Image.Image, Image.Image]:
    """Create compact tileable-looking color and normal maps for rough concrete."""
    size = 384
    rng = np.random.default_rng(seed)
    fine = rng.normal(0, 13, (size, size))
    coarse_source = rng.normal(0, 1, (size, size))
    coarse = np.asarray(
        Image.fromarray(np.uint8(np.clip((coarse_source + 3) * 36, 0, 255)))
        .filter(ImageFilter.GaussianBlur(8)),
        dtype=float,
    )
    coarse = (coarse - coarse.mean()) * 0.18
    height_map = fine + coarse

    color = np.empty((size, size, 3), dtype=np.float32)
    for channel, value in enumerate(base_rgb):
        color[:, :, channel] = value + height_map
    color = np.uint8(np.clip(color, 0, 255))
    color_image = Image.fromarray(color, "RGB")
    draw = ImageDraw.Draw(color_image)
    for _ in range(520):
        x, y = rng.integers(0, size, 2)
        radius = int(rng.choice([1, 1, 2, 2, 3]))
        shade = int(rng.integers(45, 120))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(shade, shade, shade))

    dy, dx = np.gradient(height_map)
    strength = 0.18
    normal = np.dstack((-dx * strength, -dy * strength, np.ones_like(dx)))
    normal /= np.linalg.norm(normal, axis=2, keepdims=True)
    normal = np.uint8(np.clip((normal * 0.5 + 0.5) * 255, 0, 255))
    return color_image, Image.fromarray(normal, "RGB")


def box_uv(mesh: trimesh.Trimesh, repeat: float = 9.0) -> np.ndarray:
    """Generate face-projected UVs after duplicating vertices per triangle."""
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
        uv[face] = projection * repeat
    return uv


def build_michi() -> trimesh.Trimesh:
    # Confirmed external envelope: 35 × 35 × 9 cm. The crossed rails recreate
    # the characteristic Michi footprint while retaining the central opening.
    length = 0.35
    height = 0.09
    rail_width = 0.072
    rail_offset = 0.088
    radius = 0.004

    rails = [
        box(-length / 2, y - rail_width / 2, length / 2, y + rail_width / 2)
        for y in (-rail_offset, rail_offset)
    ]
    rails.extend(
        box(x - rail_width / 2, -length / 2, x + rail_width / 2, length / 2)
        for x in (-rail_offset, rail_offset)
    )

    footprint = unary_union(rails)
    # Round the vertical outline without changing the overall nominal envelope.
    footprint = footprint.buffer(-radius, join_style="round").buffer(radius, join_style="round")
    mesh = trimesh.creation.extrude_polygon(footprint, height=height)
    mesh.apply_translation(-mesh.centroid)

    # Convert the Z-up construction geometry to glTF's Y-up presentation.
    mesh.apply_transform(trimesh.transformations.rotation_matrix(np.radians(-90), [1, 0, 0]))
    mesh.apply_translation([0, height / 2, 0])
    mesh.remove_unreferenced_vertices()
    mesh.merge_vertices()

    color_map, normal_map = concrete_maps((148, 146, 140))
    uv = box_uv(mesh)

    concrete = PBRMaterial(
        name="FORTICEM Concrete",
        baseColorFactor=[255, 255, 255, 255],
        baseColorTexture=color_map,
        normalTexture=normal_map,
        metallicFactor=0.0,
        roughnessFactor=0.9,
        alphaMode="OPAQUE",
    )
    mesh.visual = TextureVisuals(uv=uv, material=concrete)
    mesh.metadata["product"] = "Block Grass tipo Michi"
    mesh.metadata["dimensions_cm"] = "35 x 35 x 9"
    return mesh


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    scene = trimesh.Scene()
    scene.add_geometry(build_michi(), node_name="Block_Michi", geom_name="Block_Michi")
    OUTPUT.write_bytes(scene.export(file_type="glb"))
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
