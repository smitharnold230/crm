module.exports = {
  hooks: {
    readPackage(pkg) {
      // For Vercel deployment, we only need the frontend
      // Skip build scripts for packages that cause issues
      if (process.env.VERCEL) {
        // Remove build scripts from problematic packages
        if (pkg.name === 'bcrypt' || pkg.dependencies?.bcrypt) {
          delete pkg.scripts;
        }
      }
      return pkg;
    }
  }
}