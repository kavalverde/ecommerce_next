import { FC, useState, useMemo } from "react";
import NextLink from "next/link";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { IProduct } from "@/interfaces";

interface Props {
  product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? product.images[1] : product.images[0];
  }, [isHovered, product.images]);
  return (
    <Grid item xs={6} sm={4}>
      <Card>
        <NextLink
          href={`/product/${product.slug}`}
          legacyBehavior
          passHref
          prefetch={false}
        >
          <Link>
            <CardActionArea>
              {!product.inStock && (
                <Chip
                  color="primary"
                  label="No hay disponible"
                  sx={{ position: "absolute", zIndex: 99, top: 10, right: 10 }}
                />
              )}

              <CardMedia
                component={"img"}
                className="fadeIn"
                image={`${productImage}`}
                alt={product.title}
                onMouseEnter={() => {
                  if (product.inStock) setIsHovered(true);
                }}
                onMouseLeave={() => setIsHovered(false)}
                onLoad={() => setIsImageLoaded(true)}
                sx={{
                  filter: !product.inStock ? "contrast(0.5)" : "none",
                }}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      <Box
        sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }}
        className="fadeIn"
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>${product.price}</Typography>
      </Box>
    </Grid>
  );
};
