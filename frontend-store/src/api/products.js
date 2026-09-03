const API_BASE_URL = import.meta.env.VITE_API_URL;

export const get_All_Products=async () => {

    const response=await fetch(`${API_BASE_URL}/products`);
    const data=await response.json();
    return data;
    
}

export const product_By_Id=async (id) => {

    const response=await fetch(`${API_BASE_URL}/products/${id}`);
    const data=await response.json();

    return data;
    
}

export const searchProduct=async(keyword)=>{

    const response = await fetch(`${API_BASE_URL}/products/search?keyword=${keyword}`);
  const data = await response.json();
  return data;
}
