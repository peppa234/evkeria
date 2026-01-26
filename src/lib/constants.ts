export const APP_NAME = "Evkeria";
export const APP_DESCRIPTION = "Discover, Network & Innovate - Explore volunteering, events, trainings, and exchange programs across Algeria";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// File upload constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024); // 5MB

// Authentication constants
export const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
export const TOKEN_MAX_AGE_DAYS = 7;

// File cleanup constants
export const DEFAULT_CLEANUP_KEEP_COUNT = 5; // Keep last N files per entity

// Pagination constants
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;