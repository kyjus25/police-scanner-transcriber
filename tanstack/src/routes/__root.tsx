import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/solid-router";
import { TanStackDevtools } from "@tanstack/solid-devtools";

import { HydrationScript } from "solid-js/web";
import { lazy, Suspense } from "solid-js";

import styleCss from "../styles.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

export const Route = createRootRouteWithContext()({
  head: () => ({
    links: [{ rel: "stylesheet", href: styleCss }],
  }),
  shellComponent: RootComponent,
});

function RootComponent() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        experimental_prefetchInRender: true,
        retry: 0,
      },
    },
  });

  const SolidQueryDevtoolsPanel = lazy(() =>
    import("@tanstack/solid-query-devtools").then((mod) => ({
      default: mod.SolidQueryDevtoolsPanel,
    }))
  );
  const TanStackRouterDevtoolsPanel = lazy(() =>
    import("@tanstack/solid-router-devtools").then((mod) => ({
      default: mod.TanStackRouterDevtoolsPanel,
    }))
  );

  return (
    <html>
      <head>
        <HydrationScript />
      </head>
      <body>
        <HeadContent />
        <Suspense>
          <QueryClientProvider client={queryClient}>
            <Outlet />
            <TanStackDevtools
              plugins={[
                {
                  name: "TanStack Query",
                  defaultOpen: true,
                  render: <SolidQueryDevtoolsPanel />,
                },
                {
                  name: "TanStack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </QueryClientProvider>
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
