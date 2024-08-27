import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard.jsx";
import { data } from "../../Assets/data/data.js"; // Assuming this is your filter data
import "./ProductPage.css";

const ProductPage = () => {
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [productsData, setProductsData] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});

  useEffect(() => {
    const fetchClothing = async () => {
      try {
        const menRes = await fetch("https://fakestoreapi.com/products/category/men's clothing");
        const womenRes = await fetch("https://fakestoreapi.com/products/category/women's clothing");

        const menData = await menRes.json();
        const womenData = await womenRes.json();

        const combinedData = [...menData, ...womenData];
        setProductsData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClothing();
  }, []);

  const handleFilterClick = () => {
    setFilterOpen((prev) => !prev);
  };

  const handleDropdownClick = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLikeClick = (id) => {
    setLikedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <main className="product-page">
      <div className="filter-sort-bar">
        <div className="items-filter-container">
          <p className="items-count">{productsData.length} ITEMS</p>
          <button
            onClick={handleFilterClick}
            aria-expanded={isFilterOpen}
            aria-controls="filter-options"
            className="filter-button"
          >
            {isFilterOpen ? "< HIDE FILTER" : "> SHOW FILTER"}
          </button>
        </div>
        <select name="sort-options" id="sort-options" className="sort-select">
          <option value="">RECOMMENDED</option>
          <option value="">NEWEST FIRST</option>
          <option value="">POPULAR</option>
          <option value="">PRICE: HIGH TO LOW</option>
          <option value="">PRICE: LOW TO HIGH</option>
        </select>
      </div>
      <hr className="single-hr" />
      <div className={`filter-product-section ${isFilterOpen ? "filter-open" : ""}`}>
        {isFilterOpen && (
          <div id="filter-options" className="filter-options">
            <label htmlFor="customizable">
              <input type="checkbox" id="customizable" />
              CUSTOMIZABLE
            </label>
            {data.map((item) => (
              <div key={item.id} className="filter-option">
                <hr />
                <div>
                  <button
                    onClick={() => handleDropdownClick(item.id)}
                    className="dropdown-button"
                  >
                    <div className="Item-btn">
                      {item.Btn}{" "}
                      <span
                        className={`dropdown-arrow ${
                          openDropdowns[item.id] ? "open" : ""
                        }`}
                      >
                        <img src="https://www.svgrepo.com/show/335062/dropdown.svg" alt="dropdown icon" className="drop" />
                      </span>
                    </div>
                    <div>
                      <span className="all-span">All</span>
                    </div>
                  </button>
                  {openDropdowns[item.id] && (
                    <div className="dropdown-content">
                      <button className="btn-2">{item.btn2}</button>
                      <br />
                      {item.category.map((categoryItem, index) => (
                        <label key={index} className="category-label">
                          <input
                            type="checkbox"
                            name={`checkbox-${item.id}-${index}`}
                            value={categoryItem.toLowerCase().replace(/ /g, "-")}
                          />{" "}
                          {categoryItem.toUpperCase()}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="product-grid">
          {productsData.map((item) => (
            <ProductCard
              key={item.id}
              image={item.image} // Image from the Fakestore API
              name={item.title}
              description={
                item.description.length > 10
                  ? `${item.description.slice(0, 10)}...`
                  : item.description
              }
              onLike={() => handleLikeClick(item.id)}
              isLiked={likedProducts[item.id]}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
