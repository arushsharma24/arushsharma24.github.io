import Link from 'next/link';
// import ViewCounter from './view-counter';
// import { getViewsCount } from 'app/db/queries';
import { getBlogPosts } from '../db/blog';

export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts on software development, design, and more.',
};

export default function BlogPage() {
  let allBlogs = getBlogPosts();

  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        my blog posts
      </h1>
      <p className="prose prose-neutral dark:prose-invert">
          I write blogs on just about anything that interests me at that moment.
          <br/>
          Have not written anything significant yet, but will add more here soon :D
      </p>
      <br/>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm tracking-tight mt-1">
                {post.metadata.publishedAt}
              </p>
              {/* <Suspense fallback={<p className="h-6" />}>
                <Views slug={post.slug} />
              </Suspense> */}
            </div>
          </Link>
        ))}
    </section>
  );
}

// async function Views({ slug }: { slug: string }) {
//   let views = await getViewsCount();

//   return <ViewCounter allViews={views} slug={slug} />;
// }