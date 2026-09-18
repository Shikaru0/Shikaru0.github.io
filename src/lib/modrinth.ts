import { MODRINTH_USERNAME } from '../config';

export interface ModrinthProject {
  title: string;
  description: string;
  slug: string;
  html_url: string;
  downloads: number;
  followers: number;
  icon_url: string | null;
  categories: string[];
}

let cachedProjects: ModrinthProject[] | null = null;

export async function getModrinthProjects(): Promise<ModrinthProject[]> {
  if (cachedProjects) return cachedProjects;
  if (!MODRINTH_USERNAME) return [];

  try {
    const res = await fetch(
      `https://api.modrinth.com/v2/user/${MODRINTH_USERNAME}/projects`
    );

    if (!res.ok) return [];

    const data = await res.json();

    const projects: ModrinthProject[] = data.map((p: any) => ({
      title: p.title,
      description: p.description,
      slug: p.slug,
      html_url: `https://modrinth.com/project/${p.slug}`,
      downloads: p.downloads,
      followers: p.followers,
      icon_url: p.icon_url,
      categories: p.categories || [],
    }));

    cachedProjects = projects;
    return projects;
  } catch (error) {
    console.error('Error fetching Modrinth projects:', error);
    return [];
  }
}