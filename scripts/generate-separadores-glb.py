"""Generate the FORTICEM small, medium and large concrete spacer GLB family."""

from pathlib import Path

import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import LineString, Polygon, box
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "models" / "separadores-concreto-v1.glb"


def concrete_texture() -> Image.Image:
    size = 320
    rng = np.random.default_rng(57)
    fine = rng.normal(0, 11, (size, size))
    coarse = np.asarray(
        Image.fromarray(np.uint8(np.clip((rng.normal(0, 1, (size, size)) + 3) * 38, 0, 255)))
        .filter(ImageFilter.GaussianBlur(7)),
        dtype=float,
    )
    noise = fine + (coarse - coarse.mean()) * 0.16
    pixels = np.empty((size, size, 3), dtype=np.float32)
    for channel, value in enumerate((205, 203, 198)):
        pixels[:, :, channel] = value + noise
    image = Image.fromarray(np.uint8(np.clip(pixels, 0, 255)), "RGB")
    draw = ImageDraw.Draw(image)
    for _ in range(340):
        x, y = rng.integers(0, size, 2)
        radius = int(rng.choice([1, 1, 2]))
        shade = int(rng.integers(72, 142))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(shade, shade, shade))
    return image


def face_uv(mesh: trimesh.Trimesh) -> np.ndarray:
    mesh.unmerge_vertices()
    uv = np.zeros((len(mesh.vertices), 2), dtype=np.float32)
    for face_index, face in enumerate(mesh.faces):
        normal = np.abs(mesh.face_normals[face_index])
        vertices = mesh.vertices[face]
        axis = int(np.argmax(normal))
        projection = vertices[:, [2, 1]] if axis == 0 else vertices[:, [0, 2]] if axis == 1 else vertices[:, [0, 1]]
        uv[face] = projection * 17
    return uv


def tapered_body(height: float, material: PBRMaterial) -> trimesh.Trimesh:
    """Rounded precast body with the subtle mould-release taper seen in the reference."""
    width, depth, radius = 0.066, 0.056, 0.0038
    footprint = box(-width / 2 + radius, -depth / 2 + radius, width / 2 - radius, depth / 2 - radius).buffer(
        radius, resolution=4
    )
    mesh = trimesh.creation.extrude_polygon(footprint, height)
    mesh.apply_transform(trimesh.transformations.rotation_matrix(np.radians(-90), [1, 0, 0]))

    # The moulded body is narrower at its base, not a perfect rectangular block.
    y = mesh.vertices[:, 1]
    scale = 0.84 + 0.16 * np.clip(y / height, 0.0, 1.0)
    mesh.vertices[:, 0] *= scale
    mesh.vertices[:, 2] *= scale
    mesh.visual = TextureVisuals(uv=face_uv(mesh), material=material)
    return mesh


def extrude_profile(profile, depth: float, z: float) -> trimesh.Trimesh:
    mesh = trimesh.creation.extrude_polygon(profile, depth)
    mesh.apply_translation([0, 0, z - depth / 2])
    return mesh


def lobe_profile(side: int, top: float):
    """Closed spring lobe: outer bow plus the inner return visible from the front."""
    points = [
        (-0.004, top + 0.008),
        (-0.006, top + 0.020),
        (-0.010, top + 0.031),
        (-0.017, top + 0.037),
        (-0.023, top + 0.036),
        (-0.028, top + 0.028),
        (-0.029, top + 0.015),
        (-0.027, top + 0.008),
        (-0.023, top + 0.006),
        (-0.018, top + 0.009),
        (-0.014, top + 0.015),
        (-0.010, top + 0.021),
        (-0.007, top + 0.027),
    ]
    mirrored = [(x * side, y) for x, y in points]
    return LineString(mirrored).buffer(0.00205, resolution=5, cap_style=1, join_style=1)


def jaw_profile(side: int, top: float) -> Polygon:
    """Central flexible jaw with four moulded teeth for gripping reinforcement."""
    outer_x = 0.008 * side
    inner_x = 0.0032 * side
    tooth_x = 0.0010 * side
    points = [
        (outer_x, top + 0.006),
        (outer_x, top + 0.024),
        (inner_x, top + 0.024),
        (inner_x, top + 0.021),
        (tooth_x, top + 0.0195),
        (inner_x, top + 0.0175),
        (tooth_x, top + 0.0155),
        (inner_x, top + 0.0135),
        (tooth_x, top + 0.0115),
        (inner_x, top + 0.0095),
        (inner_x, top + 0.006),
    ]
    if side < 0:
        points.reverse()
    return Polygon(points).buffer(0)


def plastic_clip(top: float, material: PBRMaterial) -> trimesh.Trimesh:
    """Twin injection-moulded frames, joined at the foot as in the supplied views."""
    pieces: list[trimesh.Trimesh] = []
    frame_depth = 0.0030

    # Two distinct parallel frames make the side view read as the real product.
    for z in (-0.0075, 0.0075):
        base = box(-0.030, top, 0.030, top + 0.005)
        pieces.append(extrude_profile(base, frame_depth, z))
        for side in (-1, 1):
            pieces.append(extrude_profile(lobe_profile(side, top), frame_depth, z))
            pieces.append(extrude_profile(jaw_profile(side, top), frame_depth, z))

    # Low transverse bridge bonds both frames to the concrete insert.
    bridge = trimesh.creation.box(extents=[0.059, 0.004, 0.018])
    bridge.apply_translation([0, top + 0.002, 0])
    pieces.append(bridge)

    clip = trimesh.util.concatenate(pieces)
    clip.merge_vertices()
    clip.visual.material = material
    return clip


def transform_geometry(mesh: trimesh.Trimesh, position: tuple[float, float, float], yaw: float) -> trimesh.Trimesh:
    transform = trimesh.transformations.concatenate_matrices(
        trimesh.transformations.translation_matrix(position),
        trimesh.transformations.rotation_matrix(np.radians(yaw), [0, 1, 0]),
    )
    mesh.apply_transform(transform)
    return mesh


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    concrete = PBRMaterial(
        name="FORTICEM Concrete",
        baseColorFactor=[255, 255, 255, 255],
        baseColorTexture=concrete_texture(),
        metallicFactor=0.0,
        roughnessFactor=0.92,
        alphaMode="OPAQUE",
    )
    blue = PBRMaterial(
        name="FORTICEM Blue Polymer",
        baseColorFactor=[4, 54, 151, 255],
        metallicFactor=0.0,
        roughnessFactor=0.28,
        alphaMode="OPAQUE",
    )

    scene = trimesh.Scene()
    variants = [
        ("2_5_cm", 0.025, (-0.061, 0.0, 0.030), -7),
        ("4_cm", 0.040, (0.061, 0.0, 0.030), 7),
        ("7_cm", 0.070, (0.0, 0.0, -0.036), 0),
    ]

    for name, height, position, yaw in variants:
        body = transform_geometry(tapered_body(height, concrete), position, yaw)
        clip = transform_geometry(plastic_clip(height, blue), position, yaw)
        scene.add_geometry(body, node_name=f"Separador_{name}", geom_name=f"Separador_{name}")
        scene.add_geometry(clip, node_name=f"Clip_{name}", geom_name=f"Clip_{name}")

    OUTPUT.write_bytes(scene.export(file_type="glb"))
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
