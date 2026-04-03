import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/PKG Group logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = ["Home", "About", "Services", "Gallery", "Menu", "Stats", "Contact"];

  const handleNavClick = (item) => {
    setMobileOpen(false); // Close drawer on click
    if (item === "Home") {
      navigate("/");
    } else if (item === "Stats") {
      navigate("/stats");
    } else {
      // Future routing for other sections
      navigate("/");
    }
  };

  const drawer = (
    <Box sx={{ width: 250, bgcolor: "#0a0f3c", height: "100%", color: "#fff", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => handleNavClick(item)} sx={{ textAlign: "center", py: 2 }}>
              <ListItemText primary={item} sx={{ color: "#fff" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, md: "2vw" },
          py: { xs: 1, md: "0.5vw" },
          background: "#f5f5f5",
          fontSize: "clamp(10px, 1vw, 14px)",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <LocationOnIcon sx={{ fontSize: "clamp(12px, 1.2vw, 18px)", color: "#ff6b00" }} />
          Chennai
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <PhoneIcon sx={{ fontSize: "clamp(12px, 1.2vw, 18px)", color: "#ff6b00" }} />
          +91 79047 83186
        </Box>
      </Box>

      <AppBar position="sticky" sx={{ background: "#0a0f3c", zIndex: 1100 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
          <Box component="img" src={logo} alt="PKG Groups Logo" sx={{ height: "clamp(40px, 5vw, 60px)", cursor: "pointer", py: 1 }} onClick={() => navigate("/")} />

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: "2vw" }}>
            {navItems.map((item) => (
              <Button
                key={item}
                onClick={() => handleNavClick(item)}
                sx={{
                  color: "#fff",
                  position: "relative",
                  "&:hover::after": {
                    width: "100%",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0%",
                    height: "2px",
                    bottom: 0,
                    left: 0,
                    backgroundColor: "#ff6b00",
                    transition: "0.3s",
                  },
                  fontSize: "14px",
                  minWidth: 0,
                  padding: "1vw"
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250, border: "none" },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}