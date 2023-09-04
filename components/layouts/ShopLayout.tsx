import Head from "next/head";
import { FC } from "react";
import { Navbar, SideMenu } from "../ui";

interface Props {
  children?: React.ReactNode;
  title: string;
  page_description: string;
  image_full_url?: string;
}

export const ShopLayout: FC<Props> = ({
  children,
  title,
  page_description,
  image_full_url,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={page_description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={page_description} />
        {image_full_url && (
          <meta property="og:image" content={image_full_url} />
        )}
      </Head>
      <nav>
        <Navbar />
      </nav>
      {/* TODO sidebar */}
      <SideMenu />
      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0 30px",
        }}
      >
        {children}
      </main>
      <footer>{/* TODO footer */}</footer>
    </>
  );
};
