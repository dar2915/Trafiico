/** @type {import('next').NextConfig} */

module.exports = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/signin",
        permanent: false,
      },
      {
        source: "/admin/dashboard",
        destination: "/admin/dashboard/dashboard",
        permanent: false,
      },
      {
        source: "/personnel",
        destination: "/personnel/dashboard/dashboard",
        permanent: false,
      },
      {
        source: "/passenger",
        destination: "/passenger/dashboard",
        permanent: false,
      },
    ];
  },
};
