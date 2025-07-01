import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    availability: string;
    bio: string;
    profileImage: string;
    languages: string[];
    interests: string[];
  };
  social: {
    [key: string]: {
      url: string;
      username: string;
    };
  };
  education: {
    university: string;
    degree: string;
    graduationYear: string;
  };
  experience: {
    totalYears: number;
    specialties: string[];
  };
  aboutHighlights: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  stats: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
    ogImage: string;
  };
  lastUpdated: string;
}

const DATA_FILE_PATH = join(process.cwd(), 'src', 'data', 'portfolio.json');

/**
 * 포트폴리오 데이터를 읽어옵니다
 */
export function getPortfolioData(): PortfolioData {
  try {
    const data = readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('포트폴리오 데이터를 읽는 중 오류가 발생했습니다:', error);
    throw new Error('포트폴리오 데이터를 읽을 수 없습니다');
  }
}

/**
 * 포트폴리오 데이터를 저장합니다
 */
export function savePortfolioData(data: PortfolioData): void {
  try {
    // lastUpdated 자동 업데이트
    data.lastUpdated = new Date().toISOString();

    const jsonData = JSON.stringify(data, null, 2);
    writeFileSync(DATA_FILE_PATH, jsonData, 'utf-8');
  } catch (error) {
    console.error('포트폴리오 데이터를 저장하는 중 오류가 발생했습니다:', error);
    throw new Error('포트폴리오 데이터를 저장할 수 없습니다');
  }
}

/**
 * 개인 정보만 업데이트합니다
 */
export function updatePersonalInfo(personalData: Partial<PortfolioData['personal']>): void {
  const currentData = getPortfolioData();
  currentData.personal = { ...currentData.personal, ...personalData };
  savePortfolioData(currentData);
}

/**
 * 소셜 링크만 업데이트합니다
 */
export function updateSocialLinks(socialData: Partial<PortfolioData['social']>): void {
  const currentData = getPortfolioData();
  // undefined 값들을 필터링하여 타입 안전성 보장
  const filteredSocialData = Object.fromEntries(
    Object.entries(socialData).filter(([_, value]) => value !== undefined)
  ) as PortfolioData['social'];

  currentData.social = { ...currentData.social, ...filteredSocialData };
  savePortfolioData(currentData);
}

/**
 * About 섹션 하이라이트를 업데이트합니다
 */
export function updateAboutHighlights(highlights: PortfolioData['aboutHighlights']): void {
  const currentData = getPortfolioData();
  currentData.aboutHighlights = highlights;
  savePortfolioData(currentData);
}

/**
 * 통계 정보를 업데이트합니다
 */
export function updateStats(stats: PortfolioData['stats']): void {
  const currentData = getPortfolioData();
  currentData.stats = stats;
  savePortfolioData(currentData);
}

/**
 * SEO 정보를 업데이트합니다
 */
export function updateSEOInfo(seoData: Partial<PortfolioData['seo']>): void {
  const currentData = getPortfolioData();
  currentData.seo = { ...currentData.seo, ...seoData };
  savePortfolioData(currentData);
}
