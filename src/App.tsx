import faker from "faker";
import "./styles.css";
import VirtualizeList from "./components/VirtualizeList";

export default function App() {
  return (
    <div className="App">
      <VirtualizeList
        items={[...Array(200)].map(() => ({
          title: faker.lorem.slug(),
          desc: faker.lorem.words(5),
          image: faker.image.imageUrl(100, 100, "animal", false, true),
          test: "",
        }))}
        viewHeight={500}
        itemHeight={100}
        render={({ image, title, desc }) => (
          <div style={{ display: "flex" }}>
            <div className={"image-section"} style={{ marginRight: 20 }}>
              <img src={image} alt={title} />
            </div>
            <div
              className={"text-section"}
              style={{ flex: 1, alignSelf: "center" }}
            >
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
