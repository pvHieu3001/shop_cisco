import React, { FC } from "react";
import HeaderFilterSection from "./components/HeaderFilterSection";
import ProductCard from "./components/ProductCard";
import ButtonPrimary from "./shared/Button/ButtonPrimary";
import { Product, PRODUCTS } from "../../../data/data";
import { useFilterProductQuery } from "../(manager)/products/ProductsEndpoints";

//
export interface SectionGridFeatureItemsProps {
  data?: Product[];
}

const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = ({
  data = PRODUCTS,
}) => {
  const [filter, setFilter] = React.useState('is_hot_deal');
  const {data : dataHot, isLoadingHot } = useFilterProductQuery('is_hot_deal');
  const {data : dataGood, isLoadingGood } = useFilterProductQuery('is_good_deal');
  const {data : dataNew, isLoadingNew } = useFilterProductQuery('is_new');
  const {data : dataHome, isLoadingHome } = useFilterProductQuery('is_show_home');
  return (
    <>
      <div className="nc-SectionGridFeatureItems relative">
        <HeaderFilterSection title="Sản phẩm bán chạy" handleFilter={setFilter}/>
        <div
          className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
        >
          {dataHot?.data?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </div>
      <div className="nc-SectionGridFeatureItems relative">
        <HeaderFilterSection title="Sản phẩm mới" handleFilter={setFilter}/>
        <div
          className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
        >
          {dataNew?.data?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </div>
      <div className="nc-SectionGridFeatureItems relative">
        <HeaderFilterSection title="Nội Thất Phòng Khách" handleFilter={setFilter}/>
        <div
          className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
        >
          {dataGood?.data?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </div>
      <div className="nc-SectionGridFeatureItems relative">
        <HeaderFilterSection title="Nội thất phòng ngủ" handleFilter={setFilter}/>
        <div
          className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
        >
          {dataHome?.data?.map((item, index) => (
            <ProductCard data={item} key={index} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionGridFeatureItems;
