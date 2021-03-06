import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    background: 'rgba(255, 203, 17, 0.1)',
  },
  leadingIcon: {
    color: '#ffcb11',
    marginRight: theme.spacing(1),
  },
  title: {
    color: '#253134',
    fontSize: 16,
    fontWeight: 600,
    flexGrow: 1,
    textAlign: 'left',
  },
  moreOptionsButton: {
    width: 36,
    height: 36,
    position: 'absolute',
    right: 8,
  },
}));

const ActionNodeHeader = () => {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <FlashOnIcon className={classes.leadingIcon} />
      <Typography className={classes.title} variant="h3">
        Action
      </Typography>
      <IconButton
        className={classes.moreOptionsButton}
        aria-label="more options"
      >
        <MoreHorizIcon />
      </IconButton>
    </header>
  );
};

export default React.memo(ActionNodeHeader);
