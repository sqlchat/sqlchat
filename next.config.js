/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  // Prevent TypeScript errors.
  typescript: {
    ignoreBuildErrors: true,
  },
};
