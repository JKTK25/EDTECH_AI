import type { NextConfig } from 'next';

// Check for required DeepSeek API key at build time - warn but don't fail
if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
  console.warn(`
    Warning: The DEEPSEEK_API_KEY environment variable is missing or empty.
    AI features will not work without this key.
    You can get a key from DeepSeek Platform and add it to a .env file:
    DEEPSEEK_API_KEY=your_deepseek_api_key_here
    
    Get your key from: https://platform.deepseek.com/api_keys
  `);
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // External packages for server components
  serverExternalPackages: ['handlebars', 'dotprompt', '@genkit-ai/core'],
  // Webpack configuration for Firebase and GenKit AI
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle ES modules compatibility for handlebars and genkit
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        handlebars: 'commonjs handlebars',
        'handlebars/runtime': 'commonjs handlebars/runtime',
      });
    }
    
    // Handle handlebars module issue with better transpilation
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/(handlebars|dotprompt|@genkit-ai)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                node: '18'
              },
              modules: 'commonjs'
            }]
          ],
          plugins: [
            ['@babel/plugin-transform-runtime', {
              regenerator: true
            }],
            ['@babel/plugin-transform-modules-commonjs']
          ]
        }
      }
    });
    
    // Ignore module warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /handlebars/,
        message: /require\.extensions/,
      },
      {
        module: /genkit/,
        message: /Module not found/,
      },
    ];
    
    return config;
  },
  // Allow cross-origin requests from codespace environment
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '*.preview.app.github.dev',
    '*.app.github.dev',
    '10.0.1.138',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add headers for Firebase auth/internal-error fix
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://securetoken.googleapis.com https://www.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://*.firebaseio.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
              "frame-src 'self' https://accounts.google.com https://content.googleapis.com https://last-35eb7.firebaseapp.com",
              "img-src 'self' data: https:",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; ')
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
