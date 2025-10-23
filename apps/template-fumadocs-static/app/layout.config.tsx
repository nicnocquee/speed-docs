import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import config from "@/content/config.json";

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
            src={process.env.PAGES_BASE_PATH + config.nav.image}
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
