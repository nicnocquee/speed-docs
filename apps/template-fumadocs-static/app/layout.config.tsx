import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import contentConfig from "@/content/config.json";

/**
 * Parse the content configuration
 * @param config - The content configuration
 * @returns The parsed configuration
 */
const parseConfig = (
  config: any
): {
  nav: {
    title: string;
    image?: string;
  };
} => {
  const theConfig = config;
  if ("image" in config.nav && config.nav.image) {
    const prefix = process.env.PAGES_BASE_PATH || "";
    theConfig.nav.image = prefix + config.nav.image;
  }
  return theConfig;
};

const config = parseConfig(contentConfig);

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        {config.nav.image && (
          <Image
            src={config.nav.image}
            alt={config.nav.title}
            width={24}
            height={24}
            className="mr-2"
          />
        )}
        {config.nav.title || "config.nav.title"}
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
