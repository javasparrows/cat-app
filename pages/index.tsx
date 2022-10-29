import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Loader } from "semantic-ui-react";

interface SearchCatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface IndexPageProps {
  initialCatImage: {
    id: string;
    url: string;
    width: number;
    height: number;
  };
}

const fetchCatImage = async (): Promise<SearchCatImage> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const result = await res.json();
  return result[0];
};

const Home: NextPage<IndexPageProps> = ({ initialCatImage }) => {
  const [catImage, setcatImage] = useState(initialCatImage);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const catImage = await fetchCatImage();
    setcatImage(catImage);
    setIsLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>猫画像アプリ</h1>
      {isLoading ? (
        <Loader active />
      ) : (
        <Image
          src={catImage.url}
          alt="cat"
          priority
          width={300}
          height={(300 / catImage.width) * catImage.height}
        />
      )}
      <button style={{ marginTop: "18" }} onClick={handleClick}>
        今日の猫さん
      </button>
      <p>↑ 押すと違う猫さんが表示されるよ</p>
    </div>
  );
};

//SSR
export const getServerSideProps: GetServerSideProps<
  IndexPageProps
> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialCatImage: catImage,
    },
  };
};

export default Home;
