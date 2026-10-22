"""
Deterministic PRNG utilities matching Mulberry32 and FNV-1a 32-bit hash.
Provides 100% reproducible demo data across runs, servers, and reloads.
"""

def to_int32(x: int) -> int:
    x = x & 0xFFFFFFFF
    if x >= 0x80000000:
        return x - 0x100000000
    return x

def imul(a: int, b: int) -> int:
    return to_int32((to_int32(a) * to_int32(b)) & 0xFFFFFFFF)

def hash_string(s: str) -> int:
    h = 2166136261
    for char in s:
        h ^= ord(char)
        h = imul(h, 16777619)
    return h & 0xFFFFFFFF

def mulberry32(seed: int):
    a = to_int32(seed)
    def rng() -> float:
        nonlocal a
        a = to_int32(a + 0x6D2B79F5)
        t = imul(a ^ ((a & 0xFFFFFFFF) >> 15), 1 | a)
        t = to_int32(t + imul(t ^ ((t & 0xFFFFFFFF) >> 7), 61 | t)) ^ t
        return float((t ^ ((t & 0xFFFFFFFF) >> 14)) & 0xFFFFFFFF) / 4294967296.0
    return rng

def seeded_random(*parts) -> float:
    key = "|".join(str(p) for p in parts)
    h = hash_string(key)
    return mulberry32(h)()

def seeded_range(min_val: float, max_val: float, *parts) -> float:
    return min_val + seeded_random(*parts) * (max_val - min_val)
