import { FeatureGrid } from '@/components/FeatureGrid';
import { Hero } from '@/components/Hero';

const items = [
  {
    id: 1,
    title: "前端假資料(沒有後端)-嬰兒推車",
    points: 500,
    image: "https://via.placeholder.com/200",
    location: "台北"
  },
  {
    id: 2,
    title: "前端假資料(沒有後端)-玩具積木",
    points: 200,
    image: "https://via.placeholder.com/200",
    location: "新北"
  }
];

async function getProducts() {
  const res = await fetch("http://127.0.0.1:8000/api/v1/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("取得商品失敗");
  }

  return res.json();
}


export default async function HomePage() {

  const products = await getProducts();
  
  return (
    <div className="space-y-10">
      <Hero />
      <FeatureGrid />
	  
	  <div style={{ padding: "20px" }}>
      <h1>商品列表</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {items.map(item => (
          <div key={item.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <img src={item.image} width="150" />
            <h3>{item.title}</h3>
            <p>點數：{item.points}</p>
            <p>{item.location}</p>
          </div>
        ))}
      </div>
      </div>
	  
	  
    </div>
	
	
	
  );
}
