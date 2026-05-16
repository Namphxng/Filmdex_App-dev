from datetime import datetime
from bson import ObjectId


def serialize(doc):
    """Convert a Mongo document (or list) into JSON-safe dict/list."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize(d) for d in doc]
    if isinstance(doc, dict):
        out = {}
        for k, v in doc.items():
            out[k] = serialize(v)
        return out
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, datetime):
        return doc.isoformat()
    return doc


def paginate(items, page=1, limit=20):
    """Match the Node tmdbService paginate() shape."""
    page = max(1, int(page))
    limit = max(1, int(limit))
    start = (page - 1) * limit
    total = len(items)
    return {
        'results': items[start:start + limit],
        'page': page,
        'totalPages': max(1, -(-total // limit)),
        'totalResults': total,
    }


def to_object_id(value):
    """Try to coerce to ObjectId; return None if invalid."""
    try:
        return ObjectId(value)
    except Exception:
        return None
