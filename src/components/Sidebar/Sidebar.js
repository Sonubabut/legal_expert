import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { MdMenu } from 'react-icons/md';
import { makeStyles } from '@material-ui/core/styles';
import './Sidebar.css';

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
  list: {
    width: 200,
  },
  logo: {
    marginTop: 5,
    height: 60,
    marginBottom: 5,
  },
  appBar: {
    backgroundColor: '#e0f7fa', // Custom color for AppBar
  },
  drawer: {
    width: 250,
  },
  listItem: {
    padding: theme.spacing(2),
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <div
      className={classes.drawer}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/" className={classes.listItem}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/chat" className={classes.listItem}>
          <ListItemText primary="Legal Expert" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="black" aria-label="menu" onClick={toggleDrawer(true)}>
            <MdMenu />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/">
              <img src="https://digitalt3.com/wp-content/uploads/2024/07/DT3-Bringing-Digital-AI-Together-Photoroom.png" alt="Logo" className={classes.logo} />
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </div>
  );
};

export default Sidebar;
