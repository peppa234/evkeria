import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@lib/errors/logger';
import { MAX_FILE_SIZE, DEFAULT_CLEANUP_KEEP_COUNT } from '@lib/constants';

export type UploadType = 'avatar' | 'logo' | 'banner' | 'event';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// MIME type to extension mapping
const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

/**
 * Get file extension from MIME type (more secure than filename)
 * @param mimeType - MIME type of the file
 * @param fallbackFileName - Original filename as fallback
 * @returns File extension (jpg, png, etc.)
 */
function getExtensionFromMime(mimeType: string, fallbackFileName: string): string {
  const ext = MIME_TO_EXT[mimeType.toLowerCase()];
  if (ext) return ext;
  
  // Fallback to filename extension if MIME not recognized
  const fileNameExt = fallbackFileName.split('.').pop()?.toLowerCase();
  return fileNameExt && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileNameExt)
    ? fileNameExt
    : 'jpg';
}

/**
 * Upload file to local storage (async)
 * @param file - File buffer
 * @param type - Type of upload (avatar, logo, banner, event)
 * @param entityId - User ID, Organization ID, or Event ID
 * @param fileName - Original file name (for extension fallback)
 * @param mimeType - MIME type of the file
 * @returns Relative URL of uploaded file (e.g., /uploads/users/userId/filename.ext)
 */
export async function uploadFile(
  file: Buffer,
  type: UploadType,
  entityId: string,
  fileName: string,
  mimeType: string
): Promise<string> {
  // Validate file size
  if (file.length > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Get extension from MIME type (more secure)
  const ext = getExtensionFromMime(mimeType, fileName);
  
  // Generate unique filename to prevent overwrites
  const uniqueFileName = `${uuidv4()}.${ext}`;
  
  // Build directory path based on type
  let uploadPath: string;
  let publicPath: string;
  
  switch (type) {
    case 'avatar':
      uploadPath = path.join(UPLOADS_DIR, 'users', entityId);
      publicPath = `/uploads/users/${entityId}/${uniqueFileName}`;
      break;
    case 'logo':
      uploadPath = path.join(UPLOADS_DIR, 'organizations', entityId);
      publicPath = `/uploads/organizations/${entityId}/${uniqueFileName}`;
      break;
    case 'banner':
    case 'event':
      uploadPath = path.join(UPLOADS_DIR, 'events', entityId);
      publicPath = `/uploads/events/${entityId}/${uniqueFileName}`;
      break;
    default:
      throw new Error('Invalid upload type');
  }

  // Create directory if it doesn't exist (async)
  await fs.mkdir(uploadPath, { recursive: true });

  // Full file path
  const filePath = path.join(uploadPath, uniqueFileName);

  // Write file (async)
  await fs.writeFile(filePath, file);

  logger.info('File uploaded successfully', {
    type,
    entityId,
    fileName: uniqueFileName,
    size: file.length,
  });

  return publicPath;
}

/**
 * Delete file from local storage (async)
 * @param fileUrl - Relative URL of the file (e.g., /uploads/users/userId/filename.ext)
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
    logger.warn('Invalid file URL for deletion', { fileUrl });
    return;
  }

  // Remove query string if present
  const cleanUrl = fileUrl.split('?')[0];
  const absolutePath = path.join(process.cwd(), 'public', cleanUrl);

  try {
    await fs.access(absolutePath); // Check if file exists
    await fs.unlink(absolutePath);
    logger.info('File deleted successfully', { fileUrl: cleanUrl });
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      logger.warn('File not found, skipping deletion', { fileUrl: cleanUrl });
    } else {
      logger.error('Error deleting file', err, { fileUrl: cleanUrl });
      throw err;
    }
  }
}

/**
 * Clean up old files for an entity (keep only the latest N files)
 * @param type - Upload type
 * @param entityId - Entity ID
 * @param keepCount - Number of files to keep (default: 5)
 */
export async function cleanupOldFiles(
  type: UploadType,
  entityId: string,
  keepCount = DEFAULT_CLEANUP_KEEP_COUNT
): Promise<void> {
  try {
    let dirPath: string;
    
    switch (type) {
      case 'avatar':
        dirPath = path.join(UPLOADS_DIR, 'users', entityId);
        break;
      case 'logo':
        dirPath = path.join(UPLOADS_DIR, 'organizations', entityId);
        break;
      case 'banner':
      case 'event':
        dirPath = path.join(UPLOADS_DIR, 'events', entityId);
        break;
      default:
        return;
    }

    const files = await fs.readdir(dirPath);
    
    if (files.length <= keepCount) {
      return; // No cleanup needed
    }

    // Get file stats and sort by modification time
    const filesWithStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        return { file, mtime: stats.mtime };
      })
    );

    // Sort by modification time (oldest first)
    filesWithStats.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

    // Delete oldest files
    const filesToDelete = filesWithStats.slice(0, filesWithStats.length - keepCount);
    
    for (const { file } of filesToDelete) {
      const filePath = path.join(dirPath, file);
      await fs.unlink(filePath);
      logger.info('Cleaned up old file', { type, entityId, file });
    }
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'ENOENT') {
      logger.error('Error cleaning up old files', err, { type, entityId });
    }
  }
}
