import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface Props {
  currentValue: number;
  onUpdateQuantity: (quantity: number) => void;
  maxValue?: number;
}
export const ItemCounter: FC<Props> = ({
  currentValue,
  onUpdateQuantity,
  maxValue,
}) => {
  const addOrRemove = (value: number, operation?: string) => {
    switch (operation) {
      case "add":
        if (maxValue && value > maxValue) return;
        onUpdateQuantity(value);
        break;

      case "remove":
        if (value < 1) return;
        onUpdateQuantity(value);
        break;

      default:
        break;
    }
  };
  return (
    <Box display={"flex"} alignItems={"center"}>
      <IconButton onClick={() => addOrRemove(currentValue - 1, "remove")}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton onClick={() => addOrRemove(currentValue + 1, "add")}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
