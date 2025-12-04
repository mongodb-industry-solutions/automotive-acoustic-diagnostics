const apiHost = process.env.API_HOST || "localhost";

const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/backend/:path*",
        destination: `http://${apiHost}:8000/:path*`,
      },
    ];
  },
};

export default nextConfig;
