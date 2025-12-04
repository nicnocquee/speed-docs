import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { remarkInstall } from "fumadocs-docgen";
import {
  rehypeCodeDefaultOptions,
  remarkAdmonition,
} from "fumadocs-core/mdx-plugins";
import { transformerTwoslash } from "fumadocs-twoslash";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs: ReturnType<typeof defineDocs> = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkInstall, remarkAdmonition],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      langs: [
        "javascript",
        "js",
        "typescript",
        "ts",
        "tsx",
        "jsx",
        "json",
        "mdx",
        "md",
        "php",
        "python",
        "ruby",
        "rust",
        "scala",
        "swift",
        "kotlin",
        "groovy",
        "haskell",
        "java",
        "c",
        "c++",
        "c#",
        "c++",
        "c#",
        "c++",
        "c#",
      ],
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash(),
      ] as any,
    },
  },
});
