// Nếu dùng fetch mặc định, bạn có thể tạo hàm helper như sau:
const BASE_URL = 'http://localhost:3000/api';

export const apiFetch = async (endpoint, options = {}) => {
  // Lấy token từ Local Storage
  const token = localStorage.getItem('token'); 
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Nếu có token thì nhét vào header Authorization
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Lỗi kết nối');
  return data;
};