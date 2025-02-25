// Copied from https://github.com/antfu/eslint-config/blob/4f90101b6ea8af8ffbb49a77ed4fba75b8c69226/src/utils.ts#L135
export const isInEditorEnv = (): boolean => {
  const isInEditorEnvForTesting =
    process.env.RC_ESLINT_CONFIG_TEST_FORCE_IS_IN_EDITOR;
  if (typeof isInEditorEnvForTesting === 'string') {
    return isInEditorEnvForTesting === String(1);
  }
  if (process.env.CI) {
    return false;
  }
  if (isInGitHooksOrLintStaged()) {
    return false;
  }
  return Boolean(
    process.env.VSCODE_PID ||
      process.env.VSCODE_CWD ||
      process.env.JETBRAINS_IDE ||
      process.env.VIM ||
      process.env.NVIM,
  );
};

// Copied form https://github.com/antfu/eslint-config/blob/4f90101b6ea8af8ffbb49a77ed4fba75b8c69226/src/utils.ts#L149
export const isInGitHooksOrLintStaged = (): boolean => {
  return Boolean(
    process.env.GIT_PARAMS ||
      process.env.VSCODE_GIT_COMMAND ||
      process.env.npm_lifecycle_script?.startsWith('lint-staged'),
  );
};
