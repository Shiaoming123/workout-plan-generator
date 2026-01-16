/**
 * 本地资源管理工具
 *
 * 用于下载和保存运动演示资源（图片和视频）到本地
 * 实现混合方案：常用运动使用本地资源，其他使用 API
 */

import type { AscendExercise } from './exerciseDBClient';

// 声明 Node.js 全局变量类型
declare const require: any;
declare const process: any;
declare const __dirname: string;

/**
 * 本地资源配置
 */
const LOCAL_ASSETS_CONFIG = {
  baseDir: '/assets/exercises',
  imagesDir: '/assets/exercises/images',
  videosDir: '/assets/exercises/videos',
  // 常用运动列表（这些会被优先下载到本地）
  priorityExerciseIds: [
    'upper_1',    // Push-ups
    'upper_2',    // Dumbbell Bench Press
    'lower_1',    // Bodyweight Squats
    'lower_2',    // Goblet Squats
    'core_1',     // Plank
    'core_2',     // Side Plank
    'warmup_1',   // Jumping Jacks
    'hiit_1',     // Burpees
  ],
};

/**
 * 检查资源是否已本地存在
 *
 * @param url - 资源 URL
 * @returns 本地路径或 null
 */
export function getLocalResourcePath(url: string): string | null {
  // 从 URL 提取文件名
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1];

  // 检查是图片还是视频
  if (url.includes('/images/') || url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return `${LOCAL_ASSETS_CONFIG.imagesDir}/${filename}`;
  }

  if (url.includes('/videos/') || url.match(/\.(mp4|webm)$/i)) {
    return `${LOCAL_ASSETS_CONFIG.videosDir}/${filename}`;
  }

  return null;
}

/**
 * 检查本地资源是否存在
 *
 * @param localPath - 本地路径
 * @returns 是否存在
 */
export async function localResourceExists(localPath: string): Promise<boolean> {
  try {
    const response = await fetch(localPath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 获取本地资源的完整 URL
 *
 * @param url - 原始 URL
 * @returns 本地 URL 或原始 URL
 */
export function getLocalOrRemoteURL(url: string): string {
  const localPath = getLocalResourcePath(url);
  if (localPath) {
    return localPath;
  }
  return url;
}

/**
 * 初始化本地资源目录结构
 *
 * 注意：这需要在项目构建时运行，或在开发环境中手动创建目录
 */
export function initLocalAssetDirectories(): void {
  // 这些目录需要在 public 文件夹中创建
  const directories = [
    'public/assets/exercises',
    'public/assets/exercises/images',
    'public/assets/exercises/videos',
  ];

  // 仅在 Node.js 环境中运行（构建脚本）
  if (typeof window === 'undefined') {
    const fs = require('fs');
    const path = require('path');

    directories.forEach((dir) => {
      const fullPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ 创建目录: ${dir}`);
      }
    });
  }
}

/**
 * 获取需要本地化的运动 ID 列表
 *
 * @returns 优先级运动 ID 列表
 */
export function getPriorityExerciseIds(): string[] {
  return LOCAL_ASSETS_CONFIG.priorityExerciseIds;
}

/**
 * 下载并保存资源到本地（仅用于构建时脚本）
 *
 * @param exerciseId - 运动 ID
 * @param exerciseData - API 返回的运动数据
 * @param outputDir - 输出目录
 */
export async function downloadExerciseAssets(
  exerciseId: string,
  exerciseData: AscendExercise,
  outputDir: string = 'public/assets/exercises'
): Promise<void> {
  // 此函数仅在 Node.js 环境中使用（构建脚本）
  if (typeof window !== 'undefined') {
    console.warn('downloadExerciseAssets 只能在 Node.js 环境中使用');
    return;
  }

  const fs = require('fs');
  const https = require('https');
  const http = require('http');
  const path = require('path');

  const downloadFile = (url: string, filepath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;

      const file = fs.createWriteStream(filepath);

      protocol.get(url, (response: any) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✅ 下载完成: ${path.basename(filepath)}`);
            resolve();
          });
        } else {
          file.close();
          fs.unlink(filepath, () => {});
          reject(new Error(`下载失败: ${response.statusCode}`));
        }
      }).on('error', (err: any) => {
        file.close();
        fs.unlink(filepath, () => {});
        reject(err);
      });
    });
  };

  try {
    // 下载图片
    if (exerciseData.imageUrl) {
      const imageUrl = exerciseData.imageUrl;
      const imageFilename = imageUrl.split('/').pop() || `${exerciseId}.jpg`;
      const imagePath = path.join(outputDir, 'images', imageFilename);

      // 确保目录存在
      fs.mkdirSync(path.dirname(imagePath), { recursive: true });

      console.log(`📥 下载图片: ${exerciseData.name}`);
      await downloadFile(imageUrl, imagePath);
    }

    // 下载视频
    if (exerciseData.videoUrl) {
      const videoUrl = exerciseData.videoUrl;
      const videoFilename = videoUrl.split('/').pop() || `${exerciseId}.mp4`;
      const videoPath = path.join(outputDir, 'videos', videoFilename);

      // 确保目录存在
      fs.mkdirSync(path.dirname(videoPath), { recursive: true });

      console.log(`📥 下载视频: ${exerciseData.name}`);
      await downloadFile(videoUrl, videoPath);
    }

    console.log(`✅ ${exerciseData.name} 资源下载完成`);
  } catch (error) {
    console.error(`❌ 下载 ${exerciseData.name} 资源失败:`, error);
  }
}

/**
 * 获取本地资源映射表
 *
 * 用于构建时生成本地资源配置文件
 */
export interface LocalAssetMapping {
  exerciseId: string;
  exerciseName: string;
  exerciseNameZh: string;
  localImagePath: string | null;
  localVideoPath: string | null;
  originalImageUrl: string;
  originalVideoUrl?: string;
}

/**
 * 生成本地资源映射表
 *
 * @param exercises - 运动数据列表
 * @returns 映射表
 */
export function generateLocalAssetMapping(
  exercises: Array<{ exerciseId: string; data: AscendExercise }>
): LocalAssetMapping[] {
  return exercises.map(({ exerciseId, data }) => {
    const mapping: LocalAssetMapping = {
      exerciseId,
      exerciseName: data.name,
      exerciseNameZh: '', // 需要从我们的数据库获取
      localImagePath: null,
      localVideoPath: null,
      originalImageUrl: data.imageUrl,
      originalVideoUrl: data.videoUrl,
    };

    // 检查本地资源
    if (data.imageUrl) {
      mapping.localImagePath = getLocalResourcePath(data.imageUrl);
    }

    if (data.videoUrl) {
      mapping.localVideoPath = getLocalResourcePath(data.videoUrl);
    }

    return mapping;
  });
}
