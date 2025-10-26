import fs from 'fs';
import path from 'path';
import { TEMP_DIR, FILE_RETENTION_HOURS } from '../config/config.js';

/**
 * File cleanup utility for managing temporary compressed images
 */

/**
 * Remove files older than the retention period
 * @param {string} directory - Directory to clean up
 * @param {number} retentionHours - Hours to keep files
 * @returns {Object} Cleanup statistics
 */
export const cleanupOldFiles = (directory = TEMP_DIR, retentionHours = FILE_RETENTION_HOURS) => {
  const stats = {
    totalFiles: 0,
    deletedFiles: 0,
    errors: 0,
    freedSpace: 0
  };

  try {
    if (!fs.existsSync(directory)) {
      console.log(`Cleanup: Directory ${directory} does not exist`);
      return stats;
    }

    const files = fs.readdirSync(directory);
    const now = Date.now();
    const retentionMs = retentionHours * 60 * 60 * 1000;

    stats.totalFiles = files.length;

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      const fileAge = now - stat.mtime.getTime();

      if (fileAge > retentionMs) {
        try {
          fs.unlinkSync(filePath);
          stats.deletedFiles++;
          stats.freedSpace += stat.size;
          console.log(`Cleanup: Deleted ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
        } catch (deleteError) {
          console.error(`Cleanup: Failed to delete ${file}:`, deleteError.message);
          stats.errors++;
        }
      }
    }

    console.log(`Cleanup: Processed ${stats.totalFiles} files, deleted ${stats.deletedFiles}, freed ${(stats.freedSpace / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('Cleanup: Error during cleanup process:', error.message);
    stats.errors++;
  }

  return stats;
};

/**
 * Get storage statistics for the temp directory
 * @param {string} directory - Directory to analyze
 * @returns {Object} Storage statistics
 */
export const getStorageStats = (directory = TEMP_DIR) => {
  const stats = {
    totalFiles: 0,
    totalSize: 0,
    oldestFile: null,
    newestFile: null
  };

  try {
    if (!fs.existsSync(directory)) {
      return stats;
    }

    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      stats.totalFiles++;
      stats.totalSize += stat.size;

      if (!stats.oldestFile || stat.mtime < stats.oldestFile.mtime) {
        stats.oldestFile = { name: file, mtime: stat.mtime, size: stat.size };
      }

      if (!stats.newestFile || stat.mtime > stats.newestFile.mtime) {
        stats.newestFile = { name: file, mtime: stat.mtime, size: stat.size };
      }
    }
  } catch (error) {
    console.error('Cleanup: Error getting storage stats:', error.message);
  }

  return stats;
};

/**
 * Manual cleanup function for admin use
 * @param {number} customRetentionHours - Override default retention period
 * @returns {Object} Cleanup results
 */
export const performCleanup = (customRetentionHours = null) => {
  const retentionHours = customRetentionHours || FILE_RETENTION_HOURS;
  console.log(`Starting manual cleanup with ${retentionHours} hour retention`);

  const result = cleanupOldFiles(TEMP_DIR, retentionHours);
  result.storageStats = getStorageStats(TEMP_DIR);

  return result;
};