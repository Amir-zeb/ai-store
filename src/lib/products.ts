export const products: any[] = [
  { id: 1, name: "Nike Air Max", category: "shoes", color: "red", price: 45, brand: "Nike", rating: 4.5 },
  { id: 2, name: "Adidas Ultraboost", category: "shoes", color: "black", price: 120, brand: "Adidas", rating: 4.8 },
  { id: 3, name: "Levi's 501 Jeans", category: "jeans", color: "blue", price: 60, brand: "Levi's", rating: 4.3 },
  { id: 4, name: "Zara Floral Dress", category: "dress", color: "pink", price: 35, brand: "Zara", rating: 4.1 },
  { id: 5, name: "H&M Basic Tee", category: "tshirt", color: "white", price: 15, brand: "H&M", rating: 3.9 },
  { id: 6, name: "Puma Running Shoes", category: "shoes", color: "blue", price: 80, brand: "Puma", rating: 4.2 },
  { id: 7, name: "Tommy Hilfiger Polo", category: "tshirt", color: "red", price: 55, brand: "Tommy Hilfiger", rating: 4.4 },
  { id: 8, name: "Zara Slim Jeans", category: "jeans", color: "black", price: 45, brand: "Zara", rating: 4.0 },
];

// This function applies the AI-generated filter to the products array
export function filterProducts(filters: any) {
  return products.filter((p: any) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.color && p.color !== filters.color) return false;
    if (filters.brand && p.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.minRating && p.rating < filters.minRating) return false;
    return true;
  });
}