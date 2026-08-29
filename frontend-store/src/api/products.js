const API_BASE_URL='http://localhost:5000/api';

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
