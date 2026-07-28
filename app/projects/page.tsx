import Link from 'next/link';
import { getProjects, getAllTags } from '@/db/projects';

export const metadata = {
  title: 'Projects',
  description: 'A collection of projects I have worked on.',
};

export default function ProjectsPage() {
  const projects = getProjects();
  const tags = getAllTags();

  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">my projects</h1>
      
      <div className="prose prose-neutral dark:prose-invert mb-8">
        <p>
          A collection of side projects, experiments, and things I&apos;ve built over the years.
          Some are actively maintained, others are archived learning exercises.
        </p>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/projects"
            className="px-3 py-1 text-sm border rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            All
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/projects?tag=${tag}`}
              className="px-3 py-1 text-sm border rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group block p-4 border rounded-xl hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  project.metadata.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : project.metadata.status === 'wip'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                }`}
              >
                {project.metadata.status}
              </span>
              <time className="text-xs text-neutral-500 dark:text-neutral-400">
                {project.metadata.publishedAt}
              </time>
            </div>
            <h3 className="font-medium text-lg mb-1 group-hover:underline">
              {project.metadata.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
              {project.metadata.summary}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            {(project.metadata.github || project.metadata.demo) && (
              <div className="flex gap-3 mt-3 pt-3 border-t">
                {project.metadata.github && (
                  <a
                    href={project.metadata.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {project.metadata.demo && (
                  <a
                    href={project.metadata.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:underline"
                  >
                    Demo
                  </a>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-neutral-500 dark:text-neutral-400">
          No projects yet. Check back soon!
        </p>
      )}
    </section>
  );
}