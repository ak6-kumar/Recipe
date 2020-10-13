import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { useAuth } from '../lib/authentication';
import AuthModal from './auth/modal';
import { fontSizes, gridSize, shadows } from '../theme';
import Link from 'next/link';
import { mq } from '../helpers/media';


const hideOnMobile = mq({
  display: ['none', 'none', 'initial'],
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icons: {
    width: 500,
  },
}));

export const HEADER_GUTTER = [gridSize * 2, gridSize * 6];

export default function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { isAuthenticated, user, isLoading } = useAuth();
  const { signout } = useAuth();
  const onSignout = event => {
    event.preventDefault();
    signout();
  };
  const [value, setValue] = React.useState('recents');

  const handleChangeIcon = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}> 
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
         <Link href="/"><Typography variant="h6" className={classes.title}>
            Recipe.com
          </Typography></Link>

          <div className="ml-auto">
          
        {isAuthenticated?
          <div>
            <Typography variant="h6">{user.name}  <IconButton aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"><AccountCircle/></IconButton></Typography>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
              {user.isAdmin?<Link href="/admin"><MenuItem>Dashboard</MenuItem></Link>:<div></div>}
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <Link href="/fav"><MenuItem  onClick={handleClose}>My Favourite Dishes
                </MenuItem></Link>
                <Link href="/signout"><MenuItem>Log Out</MenuItem></Link>
              </Menu>
          </div>:
          <div>
          <AuthModal mode="signup">
          {({ openModal }) => (
            <Button color="inherit" onClick={openModal}>
              Join Now
              </Button>
          )}
        </AuthModal>
      <AuthModal mode="signin">
      {({ openModal }) => (
        <Button color="inherit" onClick={openModal}>
          Sign in
          </Button>
      )}
    </AuthModal>
          </div>
        }
        </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
