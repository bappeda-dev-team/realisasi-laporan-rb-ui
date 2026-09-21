import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-mahulu.kertaskerja.cc"
const API_PERENCANAAN = process.env.NEXT_PUBLIC_API_PERENCANAAN || "https://api-mahulu.kertaskerja.cc/api/v1/perencanaan"
const API_KEPEGAWAIAN = process.env.NEXT_PUBLIC_API_KEPEGAWAIAN || "https://api-mahulu.kertaskerja.cc/api/v1/kepegawaian"
const API_REALISASI = process.env.NEXT_PUBLIC_API_REALISASI || "https://api-mahulu.kertaskerja.cc/api/v1/realisasi"

const nextConfig: NextConfig = {
  rewrites: async () => [
    // {
    //   source: "/api/v1/realisasi/:path*", // panggilan fe
    //   destination: `${API_REALISASI}/:path*`, // backend
    // },
    {
      source: "/auth-api/:path*",
      destination: `${API_URL}/:path*`,
    },
    {
      source: "/perencanaan-service/:path*",
      destination: `${API_PERENCANAAN}/:path*`,
    },
    {
      source: "/kepegawaian-service/:path*",
      destination: `${API_KEPEGAWAIAN}/:path*`,
    },
  ],
};

export default nextConfig;