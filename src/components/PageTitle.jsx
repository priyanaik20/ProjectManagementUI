import Back from "./Back";

function PageTitle({ title, onBack }) {
  return (
    <div className="page-header">
      <Back onBack={onBack} />
      <h1>{title}</h1>
    </div>
  );
}

export default PageTitle;
