import Link from "next/link";

export default function Page() {
  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">hi! &nbsp; i&apos;m arush :) </h1>
      <p className="prose prose-neutral dark:prose-invert">
        I&apos;m currently a software engineer at <Link href="https://www.empirical.run/">Empirical</Link>, before which I worked at <Link href="https://www.cisco.com/">Cisco</Link>
        <br />
        <br />
        I (wish) &amp; love to travel and explore the world, think and exchange ideas with other people and enjoy life.
        <br />
        <br />
        Cheers!
        <br /><br />
        <a href="https://linkedin.com/in/arushsharma24">LinkedIn</a>
        <br />
        <a href="https://github.com/arushsharma24">GitHub</a> 
        <br />
      </p>
    </section>
  );
}
