import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        background: "transparent",
        color: "#fff",
        textAlign: "center",
        py: 3,
        mt: 5,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "clamp(1rem, 1.5vw, 1.25rem)" }}>
        PKG Groups
      </Typography>

      <Typography sx={{ fontSize: "clamp(10px, 1vw, 14px)", mt: 1 }}>
        Creating Unforgettable Celebrations
      </Typography>

      <Typography sx={{ fontSize: "clamp(8px, 0.8vw, 12px)", mt: 2, opacity: 0.7 }}>
        © 2025 PKG Groups. All rights reserved
      </Typography>
    </Box>
  );
}