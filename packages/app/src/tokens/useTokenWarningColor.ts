import { WARNING_LEVEL } from '../token-list/tokenSafety';
const defaultColor = '#000';

export function useTokenWarningTextColor(level: WARNING_LEVEL) {
  // const theme = useTheme();

  return defaultColor;

  /*
  switch (level) {
    case WARNING_LEVEL.MEDIUM:
      return theme.accentWarning;
    case WARNING_LEVEL.UNKNOWN:
      return theme.accentFailure;
    case WARNING_LEVEL.BLOCKED:
      return theme.textSecondary;
  }*/
}


export function useTokenWarningColor(level: WARNING_LEVEL) {
  // const theme = useTheme();


  switch (level) {
    case WARNING_LEVEL.MEDIUM:
      return defaultColor
    case WARNING_LEVEL.UNKNOWN:
      return defaultColor
    case WARNING_LEVEL.BLOCKED:
      return defaultColor;
  }

  return defaultColor;
}
