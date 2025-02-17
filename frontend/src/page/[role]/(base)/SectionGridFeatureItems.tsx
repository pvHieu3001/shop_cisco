import React, { FC, useEffect } from "react";
import HeaderFilterSection from "./components/HeaderFilterSection";
import ProductCard from "./components/ProductCard";
import { Product, PRODUCTS } from "../../../data/data";
import { useFilterCatProductQuery, useFilterFeatProductQuery, useSearchProductMutation } from "../(manager)/products/ProductsEndpoints";

//
export interface SectionGridFeatureItemsProps {
  data?: Product[];
}

const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = ({
  data = PRODUCTS,
}) => {

  const [filter, setFilter] = React.useState('is_hot_deal');
  const {data : dataHot } = useFilterFeatProductQuery('is_hot_deal')
  const {data : dataNew } = useFilterFeatProductQuery('is_new');
  const {data : dataGood } = useFilterCatProductQuery('LIVR');
  const {data : dataHome } = useFilterCatProductQuery('BEDR');
  const [searchProduct, {isLoading: loading}] = useSearchProductMutation();
  
  useEffect(()=>{
    searchProduct({feat: "Nội Thất Phòng Khách"}).unwrap();
  },[filter]);

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
