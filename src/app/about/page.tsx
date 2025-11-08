import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Hassan Ali, a multidisciplinary technologist, data scientist, and automation architect.',
};

export default function AboutPage() {
  return (
    <div className="prose dark:prose-invert max-w-none text-lg leading-8">
      <h1>About Hassan Ali</h1>
      <p>
        I’m Hassan Ali — a curious mind at the crossroads of AI, data science,
        automation, and web engineering. I build intelligent systems that
        make businesses smarter, faster, and infinitely more efficient.
      </p>
      <p>
        As a Senior Web Developer and AI Engineer, I turn code into impact —
        crafting scalable products, automated workflows, and data-driven
        ecosystems that perform beautifully and think intelligently. My work
        bridges creativity and computation — from machine learning pipelines
        and automation bots to SEO-optimized content architectures that
        dominate Google.
      </p>
      <p>
        When I’m not building or optimizing, I’m exploring algorithmic
        trading, experimenting with data-driven market models, and mentoring
        the next wave of developers and data scientists.
      </p>
      <p>
        For me, technology isn’t just a tool — it’s leverage. And I’m
        obsessed with using it to build systems that scale, stories that
        resonate, and solutions that evolve.
      </p>
    </div>
  );
}
