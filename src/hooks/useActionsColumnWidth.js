import { useTheme } from '@material-ui/core';

// This returns a string meant to be used as a CSS width.
// The values were determined by inspecting the resulting DOM elements.
export default function useActionsColumnWidth(numberOfActions) {
  const theme = useTheme();

  const actionWidth = '1.5rem';
  const totalActionPadding = `${
    numberOfActions * theme.spacing(1)
  }px`;
  const tableCellPadding = `${theme.spacing(4)}px`;
  const actionLabelWidth = '73px';

  const actionTdWidth = `calc(${numberOfActions} * ${actionWidth} + ${totalActionPadding} + ${tableCellPadding})`;
  const actionThWidth = `calc(${actionLabelWidth} + ${tableCellPadding})`;
  return `max(${actionTdWidth}, ${actionThWidth})`;
}
