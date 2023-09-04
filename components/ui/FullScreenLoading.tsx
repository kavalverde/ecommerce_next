import { Box, CircularProgress, Typography } from "@mui/material";

export const FullScreenLoading = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      height={"calc(100vh - 200px)"}
    >
      <CircularProgress thickness={2} />
      <Typography variant={"h2"} component={"h2"} fontWeight={200}>
        Cargando ...
      </Typography>
    </Box>
  );
};
