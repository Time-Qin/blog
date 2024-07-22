// interface CatalogProps {
//   content: any;
// }

export default function Catalog() {
  const h2List = document.querySelector("article")?.querySelectorAll("h2");
  const nodes = Array.from(h2List!).map((node) => {
    return { title: node.textContent, id: node.id };
  });

  return (
    <div className="fixed top-[78px] right-[240px] p-[20px] shadow">
      <div>目录</div>
      <ul>
        {nodes?.map((node,index) => {
          return (
            <li key={node.id}>
              <a href={`#${node.id}`}>{index+1}.{node.title}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
