import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import logo from "../../assets/PKG Group logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    if (item === "Home") {
      navigate("/");
    } else if (item === "Stats") {
      navigate("/stats");
    } else {
      // Future routing for other sections
      navigate("/");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: "2vw",
          py: "0.5vw",
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
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
          <Box component="img" src={logo} alt="PKG Groups Logo" sx={{ height: "clamp(30px, 4vw, 60px)", cursor: "pointer" }} onClick={() => navigate("/")} />

          <Box sx={{ display: "flex", gap: "2vw" }}>
            {["Home", "About", "Services", "Gallery", "Menu", "Stats", "Contact"].map(
              (item) => (
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
                    fontSize: "clamp(10px, 1vw, 14px)",
                    minWidth: 0,
                    padding: "1vw"
                  }}
                >
                  {item}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}