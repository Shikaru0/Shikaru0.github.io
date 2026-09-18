import { GITHUB_USERNAME } from '../config';

export interface Repo {
  name: string;
  description: string;
  html_url: string;
  default_branch: string;
}

let cachedRepos: Repo[] | null = null;

export async function getGithubRepos(): Promise<Repo[]> {
  if (cachedRepos) {
    return cachedRepos;
  }

  try {
    console.log('Fetching GitHub repos...'); 
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    
    if (!res.ok) {
      console.error(`GitHub API Error: ${res.status}`);
      return [];
    }
    
    const data = await res.json();
    
    const repos = data
      .filter((repo: any) => !repo.fork)
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description || 'No description provided.',
        html_url: repo.html_url,
        default_branch: repo.default_branch,
      }));

    cachedRepos = repos;
    
    return repos;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}