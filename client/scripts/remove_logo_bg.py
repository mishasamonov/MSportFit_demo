"""
Одноразове видалення однотонного світлого фону з PNG (flood fill від країв зображення).
Підходить для логотипів, де фон на краях і не з’єднаний 4-зв’язно з білими деталями всередині.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


def remove_light_edge_background(
    img: Image.Image,
    *,
    tolerance: int = 14,
) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()

    corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    bg_r = sum(c[0] for c in corners) // 4
    bg_g = sum(c[1] for c in corners) // 4
    bg_b = sum(c[2] for c in corners) // 4

    def is_bg(r: int, g: int, b: int) -> bool:
        return (
            abs(r - bg_r) <= tolerance
            and abs(g - bg_g) <= tolerance
            and abs(b - bg_b) <= tolerance
        )

    visited = set()
    q: deque[tuple[int, int]] = deque()

    def try_edge(x: int, y: int) -> None:
        if not (0 <= x < w and 0 <= y < h):
            return
        r, g, b, a = px[x, y]
        if a == 0 or not is_bg(r, g, b):
            return
        if (x, y) in visited:
            return
        visited.add((x, y))
        q.append((x, y))

    for x in range(w):
        try_edge(x, 0)
        try_edge(x, h - 1)
    for y in range(1, h - 1):
        try_edge(0, y)
        try_edge(w - 1, y)

    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            nx, ny = x + dx, y + dy
            if not (0 <= nx < w and 0 <= ny < h):
                continue
            if (nx, ny) in visited:
                continue
            r, g, b, a = px[nx, ny]
            if a == 0 or not is_bg(r, g, b):
                continue
            visited.add((nx, ny))
            q.append((nx, ny))

    return img


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    brand = root / "src" / "assets" / "brand"
    target = brand / "logo-full.png"
    if not target.is_file():
        raise SystemExit(f"Не знайдено: {target}")

    img = Image.open(target)
    out = remove_light_edge_background(img, tolerance=14)
    out.save(target, format="PNG", optimize=True)
    print(f"OK: оновлено {target}")


if __name__ == "__main__":
    main()
