from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status

from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix='/uploads', tags=['uploads'])

UPLOAD_DIRECTORY = Path('uploads/products')
MAX_IMAGE_SIZE = 5 * 1024 * 1024
ALLOWED_IMAGE_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
}


@router.post('/product-image', status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    request: Request,
    image: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    extension = ALLOWED_IMAGE_TYPES.get(image.content_type or '')
    if not extension:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Only JPEG, PNG, WebP, and GIF images are allowed.')

    content = await image.read(MAX_IMAGE_SIZE + 1)
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Image must be 5 MB or smaller.')

    UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)
    filename = f'{current_user.id}-{uuid4().hex}{extension}'
    (UPLOAD_DIRECTORY / filename).write_bytes(content)

    return {'image_url': str(request.base_url).rstrip('/') + f'/uploads/products/{filename}'}
