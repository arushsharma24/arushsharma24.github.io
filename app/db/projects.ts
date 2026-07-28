import fs from 'fs';
import path from 'path';

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  status: 'active' | 'archived' | 'wip';
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, '').trim();
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1');
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function getProjectFiles() {
  const projectsDir = path.join(process.cwd(), 'content/projects');
  return getMDXFiles(projectsDir);
}

export function getProjects() {
  const files = getProjectFiles();
  const projects = files.map((file) => {
    const { metadata, content } = readMDXFile(path.join(process.cwd(), 'content/projects', file));
    const slug = file.replace('.mdx', '');
    return { slug, metadata, content };
  });

  return projects.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });
}

export function getProjectsByTag(tag: string) {
  return getProjects().filter((project) => project.metadata.tags.includes(tag));
}

export function getProjectsByStatus(status: 'active' | 'archived' | 'wip') {
  return getProjects().filter((project) => project.metadata.status === status);
}

export function getProjectBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'content/projects', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const { metadata, content } = readMDXFile(filePath);
  return { slug, metadata, content };
}

export function getAllTags() {
  const projects = getProjects();
  const tags = new Set<string>();
  projects.forEach((project) => {
    project.metadata.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}