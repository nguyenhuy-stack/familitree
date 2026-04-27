import { Suspense } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'
import Header from '../components/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Cây Phả Hệ - Gia Đình Hạnh Phúc',
      },
      {
        name: 'description',
        content: 'Nền tảng lưu giữ và kết nối các thế hệ trong gia đình bạn một cách trực quan và hiện đại.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <QueryClientProvider client={queryClient}>
          <Header />
          <Suspense fallback={<div className="h-screen flex items-center justify-center">Đang tải phả hệ...</div>}>
            {children}
          </Suspense>
          <Toaster position="top-center" />
        </QueryClientProvider>

        <Scripts />
      </body>
    </html>
  )
}
