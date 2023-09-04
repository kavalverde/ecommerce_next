import { GetServerSideProps, NextPage } from "next";
import { ShopLayout } from "@/components/layouts";
import { Box, Typography } from "@mui/material";
import { ProductList } from "@/components/products";
import { getAllProducts, getProductByTerm } from "@/database/dbProducts";
import { IProduct } from "@/interfaces";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout
      title={"Next Ecommerce - Search"}
      page_description={"Encuentra tu producto favorito"}
    >
      <Typography variant="h1" component="h1">
        Buscar productos
      </Typography>
      {foundProducts ? (
        <Typography variant="h2" sx={{ mb: 1 }} textTransform={"capitalize"}>
          Termino: {query}
        </Typography>
      ) : (
        <Box display={"flex"}>
          <Typography variant="h2" sx={{ mb: 1 }}>
            No encontramos resultados para{" "}
          </Typography>
          <Typography
            variant="h2"
            sx={{ ml: 1 }}
            color="secondary"
            textTransform={"capitalize"}
          >
            {query}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
};
export default SearchPage;
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.trim().length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  let products = await getProductByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await getAllProducts();
  }

  //TODO: retornar recomendaciones

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};
