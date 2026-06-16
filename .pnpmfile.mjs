function beforePacking(pkg) {
  const publishedPackageJson = { ...pkg };

  delete publishedPackageJson.scripts;
  delete publishedPackageJson.devDependencies;

  return publishedPackageJson;
}

export const hooks = {
  beforePacking,
};
