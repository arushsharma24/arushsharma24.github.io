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
          This site is currently a work in progress. 
      </p>
      <br/>
      {/* <p>
      I write blogs on just about anything that interests me at that moment.
      </p> */
      // !TODO: Add a search bar for the blog page.
      // !TODO: Add calendar features with the blog / dates related stuff
      // DONE: Add a description section/one liner for the blog page.
      }
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